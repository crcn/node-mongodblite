var Collection = require('./collection');

var Database = function() {

}

/**
 * persistence (mongodb / fs / memory)
 */

Database.prototype.persist = function(persist) {
	if(!arguments.length) return this._persist;
	this._persist = persist;
}

/**
 * returns a new collection
 */

Database.prototype.collection = function(name) {
	return new Collection(this, name);
}

