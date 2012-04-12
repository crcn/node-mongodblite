var structr = require('structr');


module.exports = structr({

	/**
	 */

	__construct: function(collection, selector, ModelClass) {
		this.selector = selector;
		this.collection = collection;
		this._ModelClass = ModelClass;
	},

	/**
	 */

	each: function(fn) {

		var self = this;

		function onDoc(err, document) {
			fn(err, document);
			if(document) self.nextObject(onDoc);
		}

		this.nextObject(onDoc);
	},

	/**
	 */

	toArray: function(fn) {
		var docs = [];
		this.each(function(err, document) {
			if(!document) return fn(err, document);
			docs.push(document);
		});
	},

	/**
	 */

	nextObject: function(fn) {
		var self = this;
		this._nextObject(function(err, doc) {
			if(!doc) return fn(err, doc);
			fn(err, self._ModelClass ? new self._ModelClass(self.collection, doc) : doc);
		})
	}

})