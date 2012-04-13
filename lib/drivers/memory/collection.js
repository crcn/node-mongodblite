var Cursor = require("./cursor");


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
	}

});