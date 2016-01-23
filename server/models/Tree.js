var db = require('./Database');

/**
 * Create a Schema to hold tree information.
 */
var Descriptor = new db.Schema({
  _id: String,
  note: String,
  descriptor: [Number]
});

/**
 * Create a Schema to hold tree information.
 */
var Tree = new db.Schema({
  _id: String,
  tree: {
    type: String,
    index: true
  },
  link: String,
  imgLink: String,
  descriptors: [Descriptor]
});

if (process.env.NODE_ENV === 'development') {
    Tree.set('autoIndex', false);
}

module.exports = db.model('Tree', Tree);
