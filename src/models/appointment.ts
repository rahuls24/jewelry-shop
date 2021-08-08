import { model, Schema, Model } from 'mongoose';
import { IAppointment } from '../interfaces/models';

export const Appointment: Model<IAppointment> = model(
	'Appointment',
	new Schema({
		appointmentFrom: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		appointmentTo: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		appointmentDate: {
			type: Date,
			required: true,
		},
		appointmentDescription: {
			type: String,
			required: true,
		},
		appointmentPriority: {
			type: String,
			default: 'low',
		},
		appointmentState: {
			type: String,
			default: 'created',
		},
		appointmentCreatedOn: {
			type: Date,
			default: Date.now,
		},
	}),
);
