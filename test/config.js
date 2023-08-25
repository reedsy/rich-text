var richText = require('../lib/type').type;
var expect = require('chai').expect;
var sinon = require('sinon');
const config = require('../lib/config');

describe('config', function() {
  describe('serialization', function() {
    it('serializes metadata by default', function() {
      var delta = richText.create();
      delta.metadata = {foo: '123'};
      expect(richText.serialize(delta)).to.eql({
        ops: [],
        metadata: {foo: '123'},
      });
    });

    it('deserializes metadata by default', function() {
      var delta = richText.deserialize({
        ops: [],
        metadata: {lorem: 'ipsum'},
      });

      expect(delta.metadata).to.eql({lorem: 'ipsum'});
    });

    it('does not serialize an unspecified prop', function() {
      var delta = richText.create();
      delta.$doNotSerialize = {foo: '123'};
      expect(richText.serialize(delta)).to.eql({
        ops: [],
        metadata: undefined,
      });
    });

    it('does not deserialize an unspecified prop', function () {
      var delta = richText.deserialize({
        ops: [],
        $doNotSerialize: {lorem: 'ipsum'},
      });

      expect(delta).not.to.have.property('$doNotSerialize');
    });

    it('can specify extra props to serialize using config', function() {
      sinon.stub(config, 'serializedProperties').get(() => ({extra: true}));

      var delta = richText.create();
      delta.extra = {foo: '123'};
      expect(richText.serialize(delta)).to.eql({
        ops: [],
        extra: {foo: '123'},
      });
    });

    it('can specify extra props to deserialize using config', function () {
      sinon.stub(config, 'serializedProperties').get(() => ({extra: true}));

      var delta = richText.deserialize({
        ops: [],
        extra: {lorem: 'ipsum'},
      });

      expect(delta.extra).to.eql({lorem: 'ipsum'});
    });
  });
});
