const mongoose = require('mongoose');
const { Schema } = mongoose;

const OTP = new Schema({
	otp: {
		type: Number,
		min: [100000, 'Invalid OTP'],
		max: 999999,
	},
	generatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = OTPs = mongoose.model('OTP', OTP);
