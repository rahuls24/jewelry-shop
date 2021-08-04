import { model, Schema, Model, Document } from 'mongoose';
import { IOtp } from '../interfaces/models';

const OTP: Schema = new Schema({
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

export const Otp: Model<IOtp> = model('OTP', OTP);
