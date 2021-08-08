import { model, Schema, Model } from 'mongoose';
import { IOtp } from '../interfaces/models';

export const Otp: Model<IOtp> = model(
	'OTP',
	new Schema({
		otp: {
			type: Number,
			min: [100000, 'Invalid OTP'],
			max: 999999,
		},
		generatedAt: {
			type: Date,
			default: Date.now,
		},
	}),
);
