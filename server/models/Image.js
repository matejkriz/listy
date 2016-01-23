var db = require('./Database');

/**
* Create a Schema to hold images information.
*/
var schema = new db.Schema({
	path: String
});

module.exports = db.model('Image', schema);
