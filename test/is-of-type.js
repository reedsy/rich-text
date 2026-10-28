const Delta = require("@reedsy/quill-delta").Delta;
var richText = require('../lib/type').type;
var expect = require('chai').expect;

describe('isOfType', function() {
  it('recognises a document', function() {
    expect(richText.isOfType({ops: [{insert: 'foo\n'}]})).to.be.true;
  });

  it('recognises a document as a Delta', function() {
    expect(richText.isOfType(new Delta().insert('foo\n'))).to.be.true;
  });

  it('rejects a change', function() {
    expect(richText.isOfType({ops: [{retain: 3}, {insert: 'x'}]})).to.be.false;
  });

  it('rejects values that are not documents', function() {
    for (const value of ['foo', 1, null, undefined, [{insert: 'foo\n'}], {}]) {
      expect(richText.isOfType(value)).to.be.false;
    }
  });
});
