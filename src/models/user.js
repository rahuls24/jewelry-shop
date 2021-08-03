const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		validate: {
			validator: function (rawEmail) {
				const re =
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(rawEmail).toLowerCase());
			},
			message: (props) => `${props.value} is not a valid email address!`,
		},
		required: true,
	},
	phone: {
		type: String,
		minLength: 10,
		maxLength: 10,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	role: {
		type: String,
		required: true,
		enum: {
			values: ['admin', 'customer'],
			message: '{VALUE} is not supported',
		},
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

module.exports = mongoose.model('User', User);
