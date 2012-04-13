var Profile = new Schema({
	comments: { ref: 'Comment' },
	email: String,
	password: String
});


var Comment = new Schema({
	profile: { ref: 'Profile' },
	title: String,
	message: String
});





