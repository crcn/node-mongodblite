var Collection = require("./collection");

/**
 * database wrapper
 */

var Database = module.exports = require("./chainable").extend({


	/**
	 * constructor
	 * @param driver the db driver: memory, fs, mongo
	 * @param parent the parent database
	 */

	"override __construct": function(driver) {
		this._super();
		this._collections = {};
		this._driver = driver;
	},

	/**
	 */

	"collection": function(name) {
		return this._collections[name] || (this._collections[name] = new Collection(this, name));
	},

	/**
	 */

	"connect": function(fn) {
		var self = this;
		this.next(function() {
			var next = this;
			self._driver.connect(self._wrap(fn, function(err, target) {
				if(target) self.target(target);
				next();
			}));
		});

		return this;
	}

});