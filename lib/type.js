var Delta = require('@reedsy/quill-delta').Delta;
var DeltaWithMetadata = require('./delta-with-metadata');
const config = require('./config');

module.exports = {
  Delta: Delta,
  config: config,
  type: {
    name: 'rich-text',
    uri: 'https://github.com/reedsy/rich-text',

    create: function (initial) {
      return new DeltaWithMetadata(initial);
    },

    apply: function (snapshot, delta) {
      delta = new Delta(delta);
      var composed = new Delta(snapshot).compose(delta);

      for (var key in config.serializedProperties) {
        if (config.serializedProperties[key] && snapshot[key] !== undefined) composed[key] = snapshot[key];
      }

      return composed;
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

    // json0 asks this of any value it diffs, to delegate rich-text documents to diff
    isOfType: function (snapshot) {
      return Array.isArray(snapshot?.ops) &&
        // diff and apply only carry ops, so a value with other fields would lose changes to them
        Object.keys(snapshot).length === 1 &&
        snapshot.ops.every(function (op) {
          return op !== null && typeof op === 'object' && 'insert' in op;
        });
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
      var serialized = {ops: delta.ops};

      for (var key in config.serializedProperties) {
        if (config.serializedProperties[key] && delta[key] !== undefined) serialized[key] = delta[key];
      }

      return serialized;
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
