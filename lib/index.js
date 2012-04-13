var Database = require('./database');

exports.drivers = {
	Memory: require("./drivers/memory")
}


exports.db = function(driver) {
	return new Database(driver);
}