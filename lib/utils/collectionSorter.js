var structr = require("structr");

module.exports = new (structr({

	"sort": function(sort, stack) {

		var self = this;

		return stack.sort(function(a, b) {
			return self._sortScore(sort, a) < self._sortScore(sort, b) ? -1 : 1;
		});
	},


	/**
	 */

	"_sortScore": function(sort, item) {
		var field, desc, sort, score = 0;

		for(field in sort) {
			score += Number((sort[field] == 'desc') || (sort[field] == -1));
		}

		return score;
	}
}));