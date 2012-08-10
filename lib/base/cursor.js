var structr = require('structr'),
sift        = require('sift'),
EventEmitter = require('events').EventEmitter;


module.exports = structr(EventEmitter, {

	/**
	 */

	"override __construct": function(collection, selector, options) {
		this._super();
		this.selector    = selector;
		this.collection  = collection;
		this.options     = options || {};
		this.sift        = sift(this.selector);
		this._position   = 0;
	},

	/**
	 */

	"sort": function(key, order) {
		var sort = {};

		if(arguments.length == 2) {
			sort[key] = order;
		} else {
			sort = key;
		}

		this.options.sort = sort;

		return this;
	},

	/**
	 */

	"limit": function(count) {
		this.options.limit = count;
		this.emit("change");
		return this;
	},

	/**
	 */

	"skip": function(count) {
		this.options.skip = count;
		this._position = count;
		this.emit("change");
		return this;
	},

	/**
	 */

	"rewind": function() {
		this._position = this.options.skip || 0;
		return this;
	},

	/**
	 */

	"count": function(fn) {
		var n = 0;
		this.each(function(err, document) {
			if(!document) return fn(null, n);
			n++;
		});
	},


	/**
	 */

	"each": function(fn) {

		var self = this;

		function onDoc(err, document) {
			fn(err, document);
			if(document) self.nextObject(onDoc);
		}

		this.nextObject(onDoc);
	},

	/**
	 */

	"toArray": function(fn) {
		var docs = [];
		this.each(function(err, document) {
			if(!document) return fn(err, docs);
			docs.push(document);
		});
	},

	/**
	 */

	"abstract nextObject": function(fn) { }
})