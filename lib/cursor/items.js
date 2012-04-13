var structr = require('structr'),
Observer  = require("./observer"),
_         = require('underscore')


var Items = module.exports = structr({

	/**
	 */

	__construct: function(cursor) {
		this.cursor     = cursor;
		this.sift       = cursor.sift;
		this.collection = cursor.collection;

		this._sync();
	},

	/**
	 */

	"count": function() {
		return this._source.length;
	},

	/**
	 * listens for insert / update / remove
	 */

	"on": function(type, callback) {
		this._observer().on(type, callback);
	},

	/**
	 */

	"_observer": function() {
		return this.__observer || (this.__observer = new Observer(this));
	},

	/**
	 */

	"toArray": function(fn) {
		if(this._source) return fn(this._source);
		if(!this._source) {
			this.once("reset", fn);
		}
	},


	/**
	 * starts syncing the cursor with th
	 */

	_sync: function() {
		var self = this;

		function onChange() {
			self.cursor.toArray(function(err, items) {
				self._source = items;
				self._observer().emit("reset", items);
			});	
		}
		

		//skip, limit changes
		this.cursor.on("change", onChange);
		onChange();

		this.on("insert", function() {
			console.log("INS")
		});
	}
});

