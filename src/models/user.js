const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			required: 'Email address is required',
			validate: [validateEmail, 'Please fill a valid email address'],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please fill a valid email address',
			],
		},
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
		enum: ['admin', 'staff', 'customer'],
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
