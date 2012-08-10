var mdblite = require("../lib"),
step = require("step"),
db = mdblite.db(new mdblite.drivers.Mongo({
	database: "mdblite-test"
}))


var helloCollection = db.collection("hello");



step(

	/**
	 * remove everything first
	 */

	function() {
		console.log("dump collection")
		helloCollection.remove({}, this);
	},

	/**
	 * then hydrate
	 */

	function(err, count) {
		console.log("insert sample data");
		helloCollection.insert([
		{
			name: "Craig",
			age: 22
		},
		{
			name: "Tim",
			age:21
		},
		{
			name: "John",
			age:22
		}
		], this);
	},

	/**
	 * watch for changes
	 */

	function() {

		var cursor = helloCollection.find({age:{$gt:21}}),
		observer = cursor.observer();

		observer.on("insert", function(item) {
			console.log("inserted:");
			console.log(item)
		});

		observer.on("update", function(item) {
			console.log("updated:");
			console.log(item);
		});


		this();
	},

	/**
	 */

	function() {
		console.log("adding new person in 1 second...");
		var next = this;
		setTimeout(function() {
			helloCollection.insert([
			{
				name: "Sarah",
				age: 22
			}
			]);
			next();
		}, 1000);
	},

	/**
	 */

	function() {
		console.log("updating person in 1 second...");
		var next = this;
		setTimeout(function() {
			helloCollection.update({age: {$lt:23}}, {$set:{hobby: "football"}}, { multi: true });
		}, 1000);
	}

);

