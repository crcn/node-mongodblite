var Cursor = require("./cursor"),
sift       = require('sift'),
fiddle     = require('fiddle'),
_          = require('underscore');


var Collection = module.exports = require('../../abstract/collection').extend({

	/**
	 */

	"override __construct": function() {
		this._super.apply(null, arguments);
		this.source = [];

		//indexed items via ensureIndex
		this._dictionary = {};

		//indexes to ensure
		this._indexes = {};

		this.ensureIndex("_id");
	},

	
	/**
	 */


	find: function(selector, options, next) {
		next(null, new Cursor(this, selector, options));
	},

	/**
	 */

	insert: function(items, onInsert) {
		for(var i = 0, n = items.length; i < n; i++) {
			try {
				this._insertItem(items[i]);
			} catch(e) {
				return onInsert(e);
			}	
		}
		
		onInsert(null, items);
	},

	/**
	 */

	remove: function(selector, next) {
		
		var tester = sift(selector);

		for(var i = this.source.length; i--;) {
			var item = this.source[i];
			if(!tester.test(item)) continue;
			this._deindexItem(item);
			this.source.splice(i, 1);
		}

		next();
	},

	/**
	 */

	update: function(selector, modifiers, options, next) {
		var fiddler = fiddle(modifiers),
		sifter = sift(selector),
		multi = options.multi,
		upsert = options.upsert,
		modified = false;

		for(var i = this.source.length; i--;) {
			var item = this.source[i];
			if(sifter.test(item)) {
				fiddler(item);
				modified = true;
				if(!multi) break;
			}
		}

		if(!modified && upsert) {
			return this.insert(fiddler({}), next);
		}

		next();
	},


	/**
	 */

	ensureIndex: function(key) {
		this._indexes[key] = 1;
		this._dictionary[key] = this._dictionary[key] || {};
	},


	/**
	 */

	_insertItem: function(item) {
		this._indexItem(item);
		this.source.push(item);
	},



	/**
	 * validates the collection to make sure there are no overlapping items
	 */


	_indexItem: function(item) {

		//validate
		for(var key in this._dictionary) {
			if(this._dictionary[key][item[key]]) throw new Error(key+" "+item[key]+" already exists"); 
		}

		//insert
		for(var key in this._dictionary) {
			this._dictionary[key][item[key]] = item;
		}
	},

	/**
	 */

	_deindexItem: function(item) {
		for(var key in this._dictionary) {
			delete this._dictionary[key][item[key]];
		}
	}

});