var structr = require('structr'),
Collection  = require("./collection"),
mongodb     = require("mongodb"),
outcome     = require("outcome");


module.exports = structr(require("../../base/db"), {

	/**
	 */

	"connect": function(next) {
		var ops = this._getConnectionOptions();
		this._client = new mongodb.Db(ops.database, new mongodb.Server(ops.host, ops.port));
		// next();
		this._client.open(next);
	},


	/**
	 */

	"collection": function(name, next) {
		var self = this;
		this._client.collection(name, outcome.error(next).success(function(collection) {
			next(null, new Collection(self, collection, name));
		}));
	},

	/**
	 */


	"_getConnectionOptions": function() {

		var ops = this.options;

		return {
			host: ops.host || "127.0.0.1",
			port: Number(ops.port || 27017),
			database: ops.database,
			native_parser: ops.native_parser
		};
	}


});