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

cursor.observe(function(observer) {
	observer.on("change", function() {
		console.log("changed!")
	});
});


helloCollection.remove({age: {$lt:22}});


/*cursor.on("insert", function(item) {
	console.log("new item added!");
	console.log(item)
});




cursor.each(function(err, item) {
	if(item) console.log(item);
})*/




