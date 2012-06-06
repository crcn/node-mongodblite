var structr  = require('structr'),
EventEmitter = require('events').EventEmiter,
ObjectId     = require('../types/objectid'),
_            = require('underscore');

var Collection = module.exports = structr(EventEmitter, {

	/**
	 * constructor.
	 * @param db the database 
	 * @param name name of the collection
	 */

	"override __construct": function(database, name) {
		this._super();
		this.db   = database;
		this.name = name;
	},

	/**
	 * finds more than one item in a collection
	 * @param selector the search term
	 * @param options additional options such as sorting
	 * @param onCursor called when a cursor is ready. Omitting it returns a chained collection 
	 */


	"abstract find": function(selector, options, onCursor) { },


	/**
	 * finds one item
	 * @see find
	 */

	// "abstract findOne": function(selector, options, onItem) { },

	/**
	 * inserts one or more updates
	 * @param items the items to insert
	 * @param called when an item is inserted
	 */

	"abstract insert": function(items, onInsert) { },


	/**
	 * updates one or more items
	 * @param selector the query for searching against items
	 * @param modify items to update: $set, $inc, etc.
	 * @param options options, such as upsert, and multi
	 * @param onUpdate called on update
	 */

	"abstract update": function(selector, modify, options, onUpdate) { },

	/**
	 * removes one or more items
	 * @param selector the query to match against items to remove
	 * @param options options for removal, such as max items to remove
	 * @param onRemove called once items have been removed
	 */

	"abstract remove": function(selector, onRemove) { }


	/**
	 * drops the collection
	 */

	// "abstract drop": function() { },


	/**
	 * resets the given collection
	 */

	// "abstract reset": function(items) { }
});