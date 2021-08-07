import { model, Schema, Model } from 'mongoose';
import { IUser } from '../interfaces/models';
import { isValidEmail } from './../services/commonFunctions';

const User: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		validate: {
			validator: function (rawEmail: string): boolean {
				return isValidEmail(rawEmail);
			},
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
		type: String,
		default: false,
	},
	registerOn: {
		type: Date,
		default: Date.now,
	},
});

export const Users: Model<IUser> = model('User', User);
