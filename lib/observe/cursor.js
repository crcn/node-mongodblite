var structr  = require('structr'),
_            = require('underscore'),
EventEmitter = require('events').EventEmitter,
sift         = require('sift'),
fiddle       = require('fiddle'),
mdblite      = require('../'),
sortCollection = require("../utils/collectionSorter"),
Bucket = require("../bucket");

module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(cursor) {

		//the cursor which is keeping tabs on the selector on the parent collection
		this.cursor     = cursor;

		//the physical selector for the cursor
		this.sift       = cursor.sift;

		var self = this,
		bucket = this._bucket = new Bucket();

		["insert", "update", "remove"].forEach(function(event) {
			bucket.on(event, function(ev) {

				for(var i = ev.items.length; i--;) {
					var item = ev.items[i];

					self.emit(event, item);
					self.emit("change", item);
				}
			})
		})

		this._sync();
	},

	/**
	 */

	"dispose": function() {
		this._disposed = true;
		this.removeAllListeners();
		this._bucket.remove();
	},


	/**
	 */

	"_sync": function() {

		var self = this, sift = this.cursor.sift, bucket = this._bucket;

		this.cursor.toArray(function(err, source) {
			bucket.source = source || [];
		});

		this.cursor.collection.on("insert", function(event) {
			if(self._disposed) return;
			bucket.insert(sift(event.items));
		}).
		on("update", function(event) {
			if(self._disposed) return;
			bucket.update(event.selector, event.modifiers, event.options);
		}).
		on("remove", function(event) {
			if(self._disposed) return;
			bucket.remove(event.selector);
		});
	}

})