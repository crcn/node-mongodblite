var structr = require('structr'),
_           = require('underscore'),
EventEmitter = require('events').EventEmitter;

module.exports = structr(EventEmitter, {

	/**
	 */

	__construct: function(cursor) {
		this.cursor     = cursor;
		this.sift       = cursor.sift;
		this.collection = cursor.collection;
		this.source    = [];
		this._ready = false;

		this._listen();
		this._sync();
	},

	/**
	 */

	count: function() {
		return this.source.length;
	},


	/**
	 */

	ready: function(fn) {
		if(this._ready) return fn();
		this.on("reset", fn);
	},


	/**
	 */

	_listen: function() {

		var sift = this.sift, em = this, col = this.collection;


		["insert", "update", "remove"].forEach(function(type) {

			col.on(type, function(items) {
				var usable = sift(items);

				if(!items.length) return;

				em.emit(type, usable);


				em.emit("change", {
					type: type,
					items: usable
				})
			})
		});
	},

	/**
	 * starts syncing the cursor with th
	 */

	_sync: function() {
		var self = this;

		function onChange() {
			self.cursor.toArray(function(err, items) {
				self._ready = true;
				self._source = items;
				self.emit("reset", items);
			});	
		}
		

		//skip, limit changes
		this.cursor.on("change", onChange);
		onChange();

		this.on("insert", function() {
			console.log("INS")
		});
	}

})