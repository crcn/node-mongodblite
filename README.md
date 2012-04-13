Inspired by [meteor](http://meteor.com)


### Why?

- I wanted a decoupled library with the same level of functionality provided in [meteor](http://meteor.com)
- Cached on the client-side, and server-side. Less hits to mongodb itself.
- Allows for users to be sandboxed in their own collection (authentication).
- listening to cursors for any change


### TODO

- fork mongoose ODM and use *this* as the default driver
- REST interface mapper
- sync items to backend (persistence api)
- rest gateway example
- DNode driver
- Http driver
- object modifiers: $inc, $set, $unset, $push $pushAll, $addToSet, $pop, $pull, $pullAll, $rename, $bit (should be separate repo - fiddle?)
- cursor.emit("update") when limit, selector, or skip have changed


### Examples

Here's a simple example using the memory driver:

```javascript

var mdblite = require('mongodblite'),
db = mdblite.db(new mdblite.drivers.Memory());


var people = db.collection('people');

//add some data
people.insert([
	{
		name: "Craig",
		age: 22
	},
	{
		name: "Tim",
		age: 21
	},
	{
		name: "John",
		age: 20
	}
}
]);

//create a filter against the "people" collection
var peopleOlderThan21 = people.find({age:{$gt:21}}).limit(20);

peopleOlderThan21.observe(function(observer) {
	
	//the filtered items - max = 20
	console.log(observer.source);

	observer.on("insert", function(items) {
		//craig - source is also updated
	});

	//called when something big changes, such as limit, or skip
	observer.on("reset", function() {

	});

});


//insert a new user, triggers listener above
people.insert({
	name: "Sarah",
	age: 22
})


```


