import { model, Schema, Model } from 'mongoose';
import { IMessage } from './../interfaces/models';
import { typeChecker } from './../services/commonFunctions';

export const Message: Model<IMessage> = model(
	'Message',
	new Schema({
		sender: {
			email: {
				type: String,
				validate: {
					validator: (rawEmail: string) => typeChecker().isEmail(rawEmail),
					message: (props: any) =>
						`${props.value} is not a valid email address!`,
				},
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			receiver: {
				type: String,
				default: process.env.adminMail ?? 'admin@company.in',
			},
			messageSubject: {
				type: String,
				required: true,
			},
			messageDescription: {
				type: String,
				required: true,
			},
			priority: {
				type: String,
				default: 'low',
			},
			createdOn: {
				type: Date,
				default: Date.now,
			},
		},
	}),
);
