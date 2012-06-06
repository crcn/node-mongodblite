var structr = require('structr'),
sift = require('sift'),
traverse = require('traverse'),
sortCollection = require("../../utils/collectionSorter");

var Cursor = module.exports = require("../../base/cursor").extend({

	
	/**
	 */

	"nextObject": function(fn) {
		var self = this;

		self._all(function(err, sifted) {
			fn(null, sifted[self._position++]);
		});
	},


	/**
	 */

	"_all": function(fn) {

		var sifted;

		//TODO - async chunk
		if(this._sifted) return fn(null, this._sifted);
		sifted = sortCollection.sort(this.options.sort, this.sift(this.collection._bucket.source));


		if(this.options.limit && sifted.length > this._options.limit) {
			sifted = sifted.splice(0, this.options.limit);
		}

		fn(null, this._sifted = sifted);
	}

});


