var structr = require('structr'),
BinaryParser = require('../utils/binaryParser');


/**
 * object ID class
 */

var ObjectId = module.exports = structr({

	/**
	 */

	__construct: function() {
		this._value = generateId();
	},

	/**
	 */

	toString: function() {
		return this._value;
	},

	toJSON: function() {
		return this._value;
	}

});


var MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10),
PID = typeof process != 'undefined' ? process.pid : parseInt(Math.random() * 0xFFFFFF, 8);
inc = 0;


/**
 * generates a random, valid 24 character mongodb uid.
 */

function generateId() {
	var unixTime  = parseInt(Date.now()/1000, 10),
	time4Bytes    = BinaryParser.encodeInt(unixTime, 32, true, true),
	machine3Bytes = BinaryParser.encodeInt(MACHINE_ID, 24, false),
	pid2Bytes     = BinaryParser.fromShort(PID),
	index3Bytes   = BinaryParser.encodeInt(inc++, 24, false, true);

	return toHexString(time4Bytes + machine3Bytes + pid2Bytes + index3Bytes);	
}

/**
 */
 

function toHexString(id) {
	var hexString = '', number, value;

	for (var index = 0, len = id.length; index < len; index++) 
	{
		value = BinaryParser.toByte(id.substr(index, 1));

		number = value <= 15 ? '0' + value.toString(16) : value.toString(16);

	    hexString = hexString + number;
	}


	return hexString;
	
}