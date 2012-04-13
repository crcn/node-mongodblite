var structr = require('structr'),
Collection  = require("./collection");


module.exports = structr(require("../../abstract/db"), {

	/**
	 */

	connect: function(fn) {
		//nothing to connect. carry on.
		fn();
	},


	/**
	 */

	collection: function(name, next) {
		next(null, new Collection(this, name));
	}


});