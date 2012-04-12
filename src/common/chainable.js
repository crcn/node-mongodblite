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
		this._queue = tq.queue();
		this._isReady = false;
	},

	/**
	 * pushes a callback to the queue
	 */

	"next": function(fn) {
		this._queue.push(fn);
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
		if(this._target) return fn();

		//otherwise wait until we're ready...
		this.on("ready", fn);
	},

	/**
	 */

	"_wrap": function() {
		var args = arguments, self = this;
		return function() {
			for(var i 0, n = args.length; i < n; i++) {
				args[i].apply(self, arguments);
			}
		}
	}
})