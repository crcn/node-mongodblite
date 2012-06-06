var structr = require('structr'),
EventEmitter = require('events').EventEmitter;


structr.mixin(require("asyngleton"));

var cls = structr(EventEmitter, {
	"override __construct": function(db, name) {
		this._super();
		this.db = db;
		this.name = name;
		console.log("G")
	},
	"abstract test": function(){}
}).
extend({
	"override __construct": function() {
		this._super.apply(this, arguments);
		console.log("A");
	},
	"test": function(){}
}).
extend({
	"override __construct": function() {
		this._super.apply(this, arguments);
		console.log("D");
		console.log(this.db)
	}
});

new cls("BLAH");