var Cursor = require("./cursor"),
sift       = require('sift'),
fiddle     = require('fiddle'),
_          = require('underscore'),
Bucket     = require('../../bucket');


var Collection = module.exports = require('../../base/collection').extend({

	/**
	 */

	"override __construct": function() {
		this._super.apply(this, arguments);
		this._bucket = new Bucket();
		this._bucket.on("insert", this.getMethod("_onInsert"));

		//indexed items via ensureIndex
		this._dictionary = {};

		//indexes to ensure
		this._indexes = {};

		this.ensureIndex("_id");
	},

	/**
	 */

	"find": function(selector, options, next) {
		next(null, new Cursor(this, selector, options));
	},

	/**
	 */

	"insert": function(items, onInsert) {
		this._bucket.insert(items);
		onInsert(null, items);
	},

	/**
	 */

	"remove": function(selector, next) {
		this._bucket.remove(selector);
		next();
	},

	/**
	 */

	"update": function(selector, modifiers, options, next) {
		this._bucket.update(selector, modifiers, options);
		next();
	},

	/**
	 */

	"ensureIndex": function(key) {
		this._indexes[key]    = 1;
		this._dictionary[key] = this._dictionary[key] || {};
	},

	/**
	 */

	"_onInsert": function(event) {
		for(var i = event.items.length; i--;) {
			this._indexItem(event.items[i]);
		}
	},

	/**
	 * validates the collection to make sure there are no overlapping items
	 */

	"_indexItem": function(item) {

		//validate
		for(var key in this._dictionary) {
			if(this._dictionary[key][item[key]]) throw new Error(key + " " + item[key] + " already exists"); 
		}

		//insert
		for(var key in this._dictionary) {
			this._dictionary[key][item[key]] = item;
		}
	},

	/**
	 * removes an item from the dictionary so it doesn't barf if a new, overriding value is 
	 * inserted.
	 */

	"_deindexItem": function(item) {
		for(var key in this._dictionary) {
			delete this._dictionary[key][item[key]];
		}
	}

});