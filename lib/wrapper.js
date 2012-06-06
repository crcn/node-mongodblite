var structr  = require('structr'),
EventEmitter = require('events').EventEmitter,
tq           = require('tq');


/**
 * makes an object chainable
 */

module.exports = structr(EventEmitter, {


	/**
	 */

	"override __construct": function() {
		this._super();
		this._isReady = false;
	},


	/**
	 * the target for this chainable item
	 */

	"target": function(value) {

		if(!arguments.length) return this._target;

		if(!this._target) {
			this._target = value;
			this.emit("ready");
			this.removeAllListeners("ready");
		}

		return value;
	},

	/**
	 * called when this chain is ready to use
	 */

	"ready": function(fn) {

		//target already set? call the fn immediatly 
		if(this._target) return fn(this._target);

		//otherwise wait until we're ready...
		this.once("ready", fn);
	}
})