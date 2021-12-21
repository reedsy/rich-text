var Delta = require('@reedsy/quill-delta');
var DeltaWithMetadata = require('./delta-with-metadata');

module.exports = {
  Delta: Delta,
  type: {
    name: 'rich-text',
    uri: 'https://github.com/reedsy/rich-text',

    create: function (initial) {
      return new DeltaWithMetadata(initial);
    },

    apply: function (snapshot, delta) {
      const metadata = snapshot && snapshot.metadata;

      snapshot = new Delta(snapshot);
      delta = new Delta(delta);
      snapshot = snapshot.compose(delta);

      if (metadata) {
        snapshot.metadata = metadata;
      }

      return snapshot;
    },

    compose: function (delta1, delta2) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      return delta1.compose(delta2);
    },

    diff: function (delta1, delta2) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      return delta1.diff(delta2);
    },

    transform: function (delta1, delta2, side) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      // Fuzzer specs is in opposite order of delta interface
      return delta2.transform(delta1, side === 'left');
    },

    transformCursor: function(cursor, delta, isOwnOp) {
      return delta.transformPosition(cursor, !isOwnOp);
    },

    normalize: function(delta) {
      return delta;   // quill-delta is already canonical
    },

    serialize: function(delta) {
      return {
        ops: delta.ops,
        metadata: delta.metadata,
      };
    },

    deserialize: function(ops) {
      return new DeltaWithMetadata(ops);
    },

    transformPresence: function(range, op, isOwnOp) {
      if (!range) {
        return null;
      }

      const delta = new Delta(op);
      const start = this.transformCursor(range.index, delta, isOwnOp);
      const end = this.transformCursor(range.index + range.length, delta, isOwnOp);

      return Object.assign({}, range, {
        index: start,
        length: end - start,
      });
    },

    invertWithDoc: function(delta, doc) {
      delta = new Delta(delta);
      doc = new Delta(doc);
      return delta.invert(doc);
    }
  }
};
