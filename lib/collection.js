var Cursor = require('./cursor'),
_          = require("underscore"),
ObjectId   = require("./types/objectid"),
outcome    = require("outcome");

/**
 * wrapper for the drivers
 */

 var Collection = module.exports = require("./wrapper").extend({

 	/**
 	 * constructor
 	 * @param target the target collection we're wrapping around
 	 */

 	"override __construct": function(db, name, ModelClass) {
 		this._super();

 		var self = this;
 		this._modelClass = ModelClass;
 		this.database = db;
 		this.name = name;

 		//wait until the db is ready
 		this.step(function(next) {
 			db.ready(next);
 		});


 		//after db ready, load the collection
 		this.step(function(next) {
			db.target().collection(name, outcome.success(function(target) {
				if(target.wrapper) {
					target.wrapper(self);
				}
	 			self.target(target);
	 			next();
	 		}));
 		});
 	},
 	
 	/**
 	 * getter / setter for model class
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

 	"count": function(callback) {
 		return this.find().count(callback);
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

 		this.find(selector, options).nextObject(outcome.error(next).success(function(item) {

 			//return ONE item
 			next(null, item);
 		}));
 	},

 	/**
 	 */

 	"step insert": function(item, next) {

 		var items = item instanceof Array ? item : [item],
 		self = this;

 		//no items? skip
		if(!items.length) return next();

 		//make sure each item has an object ID before inserting
		_.each(items, function(item) {
			if(!item._id) item._id = new ObjectId();
		});

		self.target().insert(items, outcome.error(next).success(function(items) {
			self.emit("insert", { items: items });
			next();
		}));
 	},

 	/**
 	 */

 	"step ensureIndex": function(key) {
 		self.target().ensureIndex(key);
 	},

 	/**
 	 */

 	"step update": function(selector, modifiers, options, next) {

 		var self = this;

 		if(typeof options == 'function') {
 			next    = options;
 			options = undefined;
 		}

 		self.target().update(selector, modifiers, options || {}, function() {
			self.emit("update", { selector: selector, modifiers: modifiers, options: options });
			next();
		});
 	},

 	/**
 	 */

 	"step remove": function(selector, next) {
 		var self = this;
		this.target().remove(selector,  function() {
			self.emit("remove", { selector: selector });
			next();
		});
 	},

 	/**
 	 */

 	"override emit": function() {
 		this._super.apply(this, arguments);
 		this._super.call(this, "change");
 	}

 });

