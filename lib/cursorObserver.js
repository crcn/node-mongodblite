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

		this.listen();
	},

	/**
	 */

	listen: function() {

		var sift = this.sift, em = this, col = this.collection;


		["insert", "update", "remove"].forEach(function(type) {

			col.on(type, function(items) {
				var usable = sift(items);

				if(!items.length) return;

				em.emit(type, usable);


				em.emit('change', {
					type: type,
					items: usable
				})
			})
		});
	}

})