var structr = require("structr");

module.exports = structr(require("./abstract"), {

	/**
	 */

	connect: function() {
		this._abstract();
	}
});