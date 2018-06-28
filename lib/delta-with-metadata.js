var DeltaWithMetadata = function (obj) {
  let ops = [];

  if (Array.isArray(obj)) {
    ops = obj;
  } else if (obj && Array.isArray(obj.ops)) {
    ops = obj.ops;
  }

  this.ops = ops;

  if (obj && obj.metadata) {
    this.metadata = obj.metadata;
  }
};

module.exports = DeltaWithMetadata;
