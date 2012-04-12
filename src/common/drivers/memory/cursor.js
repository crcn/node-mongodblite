var structr = require('structr'),
sift = require('sift');

var Cursor = require("../../abstract/cursor").extend({

	/**
	 */

	"override __construct": function() {
		this._super.apply(this);
		this._options  = {};
		this._position = 0; 
		this._sift = sift(this.selector);

		//skipped items we need to get back to
		this._staged = [];
	}

	/**
	 */

	sort: function(key, order) {
		var sort = {};

		if(arguments.length == 2) {
			sort[key] = order;
		} else {
			sort = key;
		}

		this._options.sort = sort;

		return this;
	},

	/**
	 */

	limit: function(count) {
		this._options.limit = count;
		return this;
	},

	/**
	 */

	skip: function(count) {
		this._options.skip = count;
		this._position = count;
		return this;
	},

	/**
	 */

	rewind: function() {
		this._position = this._options.skip || 0;
	},

	/**
	 */

	_nextObject: function(fn) {

		var self = this;

		self._all(function(err, sifted) {
			fn(null, sifted[self._position++]);
		});
	},

	/**
	 */

	_all: function(fn) {

		//TODO - async chunk
		if(this._sifted) return fn(null, this._sifted);
		var sifted = this._sifted = this._sort(this._sift(this.collection.target));

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


