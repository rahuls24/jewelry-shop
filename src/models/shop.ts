import { model, Schema, Model } from 'mongoose';
import { IShop } from './../interfaces/models';

export const Shop: Model<IShop> = model(
	'Shop',
	new Schema({
		currentAdmin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		todayOpeningStatus: {
			type: Boolean,
			default: true,
		},
		currentStatus: {
			type: Boolean,
			default: true,
		},
		prices: {
			type: Schema.Types.ObjectId,
			ref: 'Price',
			required: true,
		},
	}),
);
