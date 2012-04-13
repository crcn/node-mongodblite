var structr  = require('structr'),
EventEmitter = require('events').EventEmitter,
tq           = require('tq');


/**
 * makes an object chainable
 */

module.exports = structr({


	/**
	 */

	"__construct": function() {
		this._isReady = false;
		this._queue   = tq.queue().start();
		this._em      = new EventEmitter();
	},

	/**
	 */

	"on": function(type, callback) {
		this._em.on(type, callback);
	},

	/**
	 */

	"emit": function(type, value) {
		this._em.emit(type, value);
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
			this._em.emit("ready");
			this._em.removeAllListeners("ready");
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
		this.on("ready", fn);
	},

	/**
	 */

	"_wrap": function() {

		var args = arguments, self = this;

		return function() {
			var i = 0;
			for(n = args.length; i < n; i++) {
				(args[i] || function(){}).apply(self, arguments);
			}
		}
	}
})