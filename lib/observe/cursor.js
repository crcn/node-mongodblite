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

	"_sync": function() {

		var self = this, sift = this.cursor.sift, bucket = this._bucket;

		this.cursor.toArray(function(err, source) {
			bucket.source = source || [];
		});

		this.cursor.collection.on("insert", function(event) {
			bucket.insert(sift(event.items));
		}).
		on("update", function(event) {
			bucket.update(event.selector, event.modifiers);
		}).
		on("remove", function(event) {
			bucket.remove(event.selector);
		});
	}

})