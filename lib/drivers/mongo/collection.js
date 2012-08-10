
var Collection = module.exports = require('../../base/collection').extend({

	/**
	 */

	"override __construct": function(database, collection, name) {
		this._super(database, name);
		this.collection = collection;
	},

	/**
	 */

	"find": function(selector, options, next) {
		return this.collection.find(selector, options, next);
	},

	/**
	 */

	"insert": function(items, onInsert) {
		return this.collection.insert(JSON.parse(JSON.stringify(items)), onInsert);
	},

	/**
	 */

	"update": function(selector, modify, options, onUpdate) {
		return this.collection.update(selector, modify, options, onUpdate);
	},

	/**
	 */

	"remove": function(selector, onRemove) {
		return this.collection.remove(selector, onRemove);
	}
});