var mdblite = require("../lib"),
db = mdblite.db(new mdblite.drivers.Memory());


var helloCollection = db.collection("hello");


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
]);

setTimeout(function() {
	helloCollection.insert([
	{
		name: "Sarah",
		age: 22
	}
	]);
}, 1000);

var cursor = helloCollection.find({age:{$gt:21}});

cursor.observer().on("insert", function(item) {
	console.log("changed:");
	console.log(item)
});


// helloCollection.remove({age: {$lt:23}});
helloCollection.update({age: {$lt:23}}, {$set:{hobby: "football"}});


/*cursor.on("insert", function(item) {
	console.log("new item added!");
	console.log(item)
});




cursor.each(function(err, item) {
	if(item) console.log(item);
})*/




