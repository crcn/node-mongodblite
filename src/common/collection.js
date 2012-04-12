
/**
 * wrapper for the drivers
 */

 var Collection = module.exports = require("./chainable").extend({

 	/**
 	 * constructor
 	 * @param target the target collection we're wrapping around
 	 */

 	"override __construct": function(db, name) {
 		this._super();

 		var self = this;

 		//wait for the DB to be ready before starting
 		this.next(function() {
 			db.ready(this);
 		});

 		//ready? get the collection
 		this.next(function() {
 			var next = this;
 			db.target.collection(name, function(target) {
 				self.target(target);
 				next();
 			})
 		});
 	},

 	/**
 	 */

 	"find": function(selector, options, next) {

 		if(!next) {
 			
 		}
 	}

 });

