import { model, Schema, Model } from 'mongoose';
import { IUser } from '../interfaces/models';
import { typeChecker } from './../services/commonFunctions';

export const User: Model<IUser> = model(
	'User',
	new Schema({
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			validate: {
				validator: (rawEmail: string) => typeChecker().isEmail(rawEmail),
				message: (props: any) => `${props.value} is not a valid email address!`,
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
		isVerified: {
			type: Boolean,
			default: false,
		},
		isSignWithOtp: {
			type: Boolean,
			default: false,
		},
		registerOn: {
			type: Date,
			default: Date.now,
		},
	}),
);
