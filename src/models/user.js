const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		minLength: 10,
		maxLength: 10,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	role: {
		type: String,
		required: true,
	},
	profilePic: {
		type: String,
		default: 'https://i.ibb.co/d7DYfTP/default-profile-picture1-744x744.jpg',
	},
	registerOn: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Users = mongoose.model('User', User);
