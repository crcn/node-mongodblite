/**
 * the collection 
 */


var Collection = function(db, name) {
	this.name = name;
	this.persist(db.persist());
}


Collection.prototype.persist = function(persist) {
	this._persist = persist.collection(this.name);

	//find, findOne, insert, update, upsert
	for(var property in persist) {
		this[property] = persist[property];
	}
}

