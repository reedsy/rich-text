var config = require('./config');

var DeltaWithMetadata = function (obj) {
  let ops = [];

  if (Array.isArray(obj)) {
    ops = obj;
  } else if (obj && Array.isArray(obj.ops)) {
    ops = obj.ops;
  }

  this.ops = ops;

  if (!obj) return;

  for (var key in config.serializedProperties) {
    if (config.serializedProperties[key]) this[key] = obj[key];
  }
};

module.exports = DeltaWithMetadata;
