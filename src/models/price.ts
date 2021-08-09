import { model, Schema, Model } from 'mongoose';
import { IPrice } from '../interfaces/models';
export const Price: Model<IPrice> = model(
	'Price',
	new Schema({
		gold24: {
			type: Number,
			default: -1,
		},
		gold22: {
			type: Number,
			default: -1,
		},
		gold18: {
			type: Number,
			default: -1,
		},
		sliver: {
			type: Number,
			default: -1,
		},
		platinum: {
			type: Number,
			default: -1,
		},
	}),
);
