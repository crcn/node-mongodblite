var structr = require("structr"),
EventEmitter = require("events").EventEmitter,
sift = require("sift"),
fiddle = require("fiddle");


module.exports = structr(EventEmitter, {

	/**
	 */

	"__construct": function(ops) {
		if(!ops) ops = {};
		this.limit = ops.limit;
		this.source = [];
	},

	/**
	 */

	"insert": function(item) {
		var items = item instanceof Array ? item : [item];

		if(!items.length) return [];

		var usable = [];

		for(var i = 0, n = items.length; i < n; i++) {
			var item = items[i];
			usable.push(item);
			this.source.push(item);
		}

		if(this.limit && this.source.length > this.limit) {
			this.remove("remove", this.source.slice(0, this.source.length - this.limit));
		}

		this.emit("insert", { items: usable });
	},

	/**
	 */

	"remove": function(selector, next) {
		
		var tester = sift(selector);
		var removed = [];

		for(var i = this.source.length; i--;) {
			var item = this.source[i];

			if(!tester.test(item)) continue;
			removed.push(item);
			this.source.splice(i, 1);
		}

		if(removed.length)
		this.emit("remove", { items: removed, selector: selector });
	},

	/**
	 */

	"update": function(selector, modifiers, options) {

		if(!options) options = {};

		var fiddler = fiddle(modifiers),
		sifter = sift(selector),
		multi = options.multi,
		upsert = options.upsert,
		modified = false,
		updated = [];

		for(var i = this.source.length; i--;) {
			var item = this.source[i];
			if(sifter.test(item)) {
				updated.push(item);
				fiddler(item);
				modified = true;
				if(!multi) break;
			}
		}

		if(updated.length)
		this.emit("update", { items: updated, selector: selector, modifiers: modifiers });
	},


	/**
	 */

	"bind": function(bucket) {
		this.on("insert", function(event) {
			bucket.insert(event.items);
		}).
		on("update", function(event) {
			bucket.update(event.selector, event.modifiers, {});
		}).
		on("remove", function(event) {
			bucket.remove(event.items);
		})
	}


})