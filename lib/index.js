var structr      = require('structr');
structr.mixin(require('asyngleton'));
structr.mixin(require('structr-step'));


var Database = require('./database');


exports.drivers = {
	Memory: require("./drivers/memory")
};

exports.persist = {
	Fs: null
};

exports.db = function(driver) {
	return new Database(driver);
}