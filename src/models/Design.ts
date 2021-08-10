import { model, Model, Schema } from 'mongoose';
import { IDesign } from '../interfaces/models';
import { addDaysFromToday } from '../services/commonFunctions';
export const Design: Model<IDesign> = model(
	'Design',
	new Schema({
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageAddress: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: 'No description is provided',
		},
		isAvailable: {
			type: Boolean,
			default: false,
		},
		transitiveAvailabilityDate: {
			type: Date,
			default: addDaysFromToday(30),
		},
		expectedPrice: {
			type: Number,
			default: -1,
		},
		uploadedOn: {
			type: Date,
			default: Date.now,
		},
	}),
);
