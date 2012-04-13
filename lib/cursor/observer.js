var structr  = require('structr'),
_            = require('underscore'),
EventEmitter = require('events').EventEmitter,
sift         = require('sift');

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

		var em = this, cursorSift = this.sift, col = this.collection, self = this;

		function change(type, data) {
			em.emit(type, data);
			em.emit("change");
		}

		//when an item has been inserted, figure out what to add
		col.on("insert", function(event) {

			var usable = cursorSift(event.items);

			if(!usable.length) return;

			//TODO - resort
			self.source = self.source.concat(usable);

			change("insert", { items: usable });
		});

		//when an item has changed
		col.on("update", function(event) {
			var toChange = sift(event.selector, self.source);

			//TODO
			//fiddle(event.modify, toChange);
			change("update");
		});

		//when an item has been removed
		col.on("remove", function(event) {
			var tester = sift(event.selector), rm = [], indexes = [];
			for(var i = self.source.length; i--;) {
				var item = self.source[i];
				if(tester.test(item)) {
					rm.push(item);
					indexes.push(i);
					self.source.split(i, 1);
				}
			}

			change("remove", { items: rm, indexes: indexes });
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
			
		});

		this.on("update", function() {

		});

		this.on("remove", function() {

		});
	}

})