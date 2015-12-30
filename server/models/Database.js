var mongoose = require('mongoose');
var config = require('../config');

/**
* Connecting to database. Adress is in config.json file.
*/
mongoose.connect(config.database);

module.exports = mongoose;
