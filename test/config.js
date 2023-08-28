var richText = require('../lib/type').type;
var expect = require('chai').expect;
var sinon = require('sinon');
const config = require('../lib/config');

describe('config', function() {
  afterEach(function() {
    sinon.restore();
  });

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

  describe('apply', () => {
    it('keeps metadata when applying a delta to a snapshot', function() {
      var snapshot = {
        ops: [{insert: '\n'}],
        metadata: {abc: 123},
      };
      var delta = {ops: [{insert: 'foo'}]};
      var applied = richText.apply(snapshot, delta);
      expect(applied).to.eql({
        ops: [{insert: 'foo\n'}],
        metadata: {abc: 123},
      });
    });

    it('drops unspecified props when applying a delta to a snapshot', function () {
      var snapshot = {
        ops: [{insert: '\n'}],
        extra: {abc: 123},
      };
      var delta = {ops: [{insert: 'foo'}]};
      var applied = richText.apply(snapshot, delta);
      expect(applied).to.eql({
        ops: [{insert: 'foo\n'}],
      });
    });

    it('can specify extra props to keep when applying a delta to a snapshot', function () {
      sinon.stub(config, 'serializedProperties').get(() => ({extra: true}));

      var snapshot = {
        ops: [{insert: '\n'}],
        extra: {abc: 123},
      };
      var delta = {ops: [{insert: 'foo'}]};
      var applied = richText.apply(snapshot, delta);
      expect(applied).to.eql({
        ops: [{insert: 'foo\n'}],
        extra: {abc: 123},
      });
    });
  });
});
