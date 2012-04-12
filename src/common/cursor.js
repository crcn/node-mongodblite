var tq = require('tq'),
Chainable = require('./chainable');

module.exports = require("./abstract/cursor").extend({

	/**
	 */

	"override __construct": function(collection, selector, options, ModelClass) {
		this._super(collection, selector, options);

		this._chain      = new Chainable();
		this._ModelClass = ModelClass;

		this._chain.next(function() {
			collection.ready(this);
		})
	},

	/**
	 */

	"ready": function(fn) {
		this._chain.ready(fn);
		return this;
	},

	/**
	 */

	"target": function() {
		return this._chain.apply(this._chain, arguments);
	},

	/**
	 */


	"nextObject": function(fn) {
		var self = this;
		this._cursor(function(cursor) {
			cursor.nextObject(function(err, item) {
				if(!item) return fn(err);
				fn(err, self._ModelClass ? new self._ModelClass(self.collection, item) : item)
			});
		});
	},

	/**
	 */

	"_cursor": function(fn) {

		if(this._waiting) {
			return this._chain.ready(fn);
		}

		this._waiting = true;

		var self = this;
		this._chain.next(function() {
			var next = this;
			self.collection.target().find(self.selector, self.options, function(err, cursor) {
				if(!cursor) return fn(err);
				self.target(cursor);
				fn(cursor);
			});
		});
	}
})