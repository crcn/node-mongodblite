var mdblite = require('mongodblite');


//init the database
var db = mdblite.db(new mblite.driver.Memory());


db.persist(mdblite.persistence.mongo({
	host: 'mongodb://localhost/db'
}));


var mem = db.persist.memory({
	max: 1000000, //max records in memory before dumping / persisting
	persistTimeout: 10000 //persist every N seconds
}).

//waterfall into mongodb
persist.mongo({
	host: 'mongodb://localhost:27017/someCollection'
}).

//persist to FS as well
persist.fs({
	max: 100000
});


//persist the db accordingly
db.persist(mem); //OR db.persist.memory... the latter just makes it easier to extend.


var sandbox = db.sandbox({ profile: {$in: ['profileid'] }}),


//sandbox.selector //{$in['profileid']}


