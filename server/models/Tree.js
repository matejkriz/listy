var db = require('./Database');

/**
* Create a Schema to hold tree information.
*/
var schema = new db.Schema({
  tree: String,
	link: String,
	imgLink: String,
  descriptors: [Number]
});

module.exports = db.model('Tree', schema);
