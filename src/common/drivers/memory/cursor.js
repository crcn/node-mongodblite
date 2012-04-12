var structr = require('structr'),
sift = require('sift');

var Cursor = require("../../abstract/cursor").extend({

	
	/**
	 */

	nextObject: function(fn) {
		var self = this;

		self._all(function(err, sifted) {
			fn(null, sifted[self._position++]);
		});
	},

	/**
	 */

	_all: function(fn) {

		var sifted;

		//TODO - async chunk
		if(this._sifted) return fn(null, this._sifted);
		sifted = this._sifted = this._sort(this._sift(this.collection.target));

		if(this.options.limit && sifted.length > this._options.limit) {
			sifted = sifted.splice(0, this.options.limit);
		}

		fn(null, sifted);
	},



	/**
	 */

	_sort: function(stack) {
		var self = this;

		return stack.sort(function(a, b) {
			return self._sortScore(a) < self._sortScore(b) : -1 : 1;
		});
	},


	/**
	 */

	_sortScore: function(item) {
		var field, desc, sort = this._options.sort, score = 0;

		for(field in sort) {
			score += Number((sort[field] == 'desc') || (sort[field] == -1));
		}

		return score;
	}

});


