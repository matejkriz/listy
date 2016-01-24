var db = require('./Database');

/**
 * Create a Schema to hold tree information.
 */
var Tree = new db.Schema({
  name: {
    type: String,
    index: true
  },
  nameLatin: {
    type: String,
    index: true
  },
  link: String,
  imgLink: String,
  descriptors: [{
    note: String,
    descriptor: [Number]
  }]
});

if (process.env.NODE_ENV === 'development') {
    Tree.set('autoIndex', false);
}

module.exports = db.model('Tree', Tree);
