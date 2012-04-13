var Cursor = require('./cursor'),
_          = require("underscore"),
ObjectId   = require("./types/objectid");

/**
 * wrapper for the drivers
 */

 var Collection = module.exports = require("./chainable").extend({

 	/**
 	 * constructor
 	 * @param target the target collection we're wrapping around
 	 */

 	"override __construct": function(db, name, ModelClass) {
 		var self = this;
 		this._modelClass = ModelClass;
 		this._super();

 		//wait for the DB to be ready before starting
 		this.next(function() {
 			db.ready(this);
 		});

 		//ready? get the collection
 		this.next(function() {
 			var next = this;
 			db.target().collection(name, function(err, target) {
 				self.target(target);
 				next();
 			});
 		});
 	},


 	/**
 	 */

 	"modelClass": function(value) {
 		if(!arguments.length) return this._modelClass;
 		return this._modelClass = value;
 	},

 	/**
 	 */

 	"find": function(selector, options) {
 		return new Cursor(this, selector || {}, options || {}, this._modelClass);
 	},

 	/**
 	 */

 	"findOne": function(selector, options, next) {

 		if(typeof selector == 'function') {
 			next     = selector;
 			selector = undefined;
 			options  = undefined;
 		}
 		else
 		if(typeof options == 'function') {
 			next    = options;
 			options = undefined;
 		}

 		this.find(selector, options).limit(1).toArray(function(err, items) {
 			if(err) return next(err);
 			return next(null, items);
 		});
 	},


 	/**
 	 */


 	"insert": function(item, next) {

 		var items = item instanceof Array ? item : [item],
 		self = this;

 		this.next(function() {

 			_.each(items, function(item) {
 				if(!item._id) item._id = new ObjectId();
 			})

 			self.target().insert(items, self._wrap(next || function(){}, this, function(err, items) {
 				if(err) return;
 				self.emit("insert", items);
 			}));
 		});
 	},

 	/**
 	 */

 	"ensureIndex": function(key) {
 		this.next(function() {
 			self.target().ensureIndex(key);
 		})
 	},

 	/**
 	 */

 	"update": function(selector, toUpdate, options, next) {

 		var self = this;

 		if(typeof options == 'function') {
 			next    = options;
 			options = undefined;
 		}

 		this.next(function() {
 			self.target().update(selector, toUpdate, options || {}, self._wrap(next || function(){}, this))
 		});
 	},

 	/**
 	 */

 	"remove": function(selector, next) {

 		var self = this;
 		this.next(function() {
 			self.target().remove(selector, self._wrap(next || function(){}, next));
 		});
 	}

 });

