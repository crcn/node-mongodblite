var tq       = require('tq'),
Wrapper      = require('./wrapper'),
Observer     = require('./observe/cursor');

module.exports = require("./base/cursor").extend({

	/**
	 */

	"override __construct": function(collection, selector, options, ModelClass) {
		this._super(collection, selector, options);
		this._chain      = new Wrapper();
		this._ModelClass = ModelClass;

		//wait until the collection is ready
		this.step(function(next) {
			collection.ready(next);
		});

		var self = this;

		//load the cursor
		this.step(function(next) {
			self.collection.target().find(self.selector, self.options, function(err, cursor) {	
				if(!cursor) return fn(err);
				self.target(cursor);
				next();
			});
		});
	},

	/**
	 */

	"step count": function(fn) {
		return this.target().count(fn);
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
		return this._chain.target.apply(this._chain, arguments);
	},

	/**
	 */

	"observer": function(fn) {
		return this._observer || new Observer(this);
	},

	/**
	 */

	"step nextObject": function(fn) {
		var self = this;

		this.target().nextObject(function(err, item) {
			if(!item) return fn(err);
			fn(err, self._ModelClass ? new self._ModelClass(self.collection, item) : item)
		});
	}
});

