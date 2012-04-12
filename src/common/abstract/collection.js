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

	__construct: function(database, name) {
		this.db   = database;
		this.name = name;
	}

	/**
	 * finds more than one item in a collection
	 * @param selector the search term
	 * @param options additional options such as sorting
	 * @param onCursor called when a cursor is ready. Omitting it returns a chained collection 
	 */


	find: function(selector, options, onCursor) {
		this._abstract();
	},


	/**
	 * finds one item
	 * @see find
	 */

	findOne: function(selector, options, onItem) {
		this._abstract();
	},

	/**
	 * inserts one or more updates
	 * @param items the items to insert
	 * @param called when an item is inserted
	 */

	insert: function(items, onInsert) {
		this._abstract();
	},


	/**
	 * updates one or more items
	 * @param selector the query for searching against items
	 * @param modify items to update: $set, $inc, etc.
	 * @param options options, such as upsert, and multi
	 * @param onUpdate called on update
	 */

	update: function(selector, modify, options, onUpdate) {
		this._abstract();
	},

	/**
	 * removes one or more items
	 * @param selector the query to match against items to remove
	 * @param options options for removal, such as max items to remove
	 * @param onRemove called once items have been removed
	 */

	remove: function(selector, options, onRemove) {
		this._abstract();
	},


	/**
	 * drops the collection
	 */

	drop: function() {
		this._abstract();
	},


	/**
	 * resets the given collection
	 */

	reset: function(items) {
		this._abstract();
	},


	/**
	 * throws an error
	 */

	__abstract: function() {
		throw new Error("Not implemented");
	}
});