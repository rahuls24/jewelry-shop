import { Appointment } from './../models/appointment';

export const commonAppointmentFunctions = () => {
	const createAppointment = async (appointmentData: any) => {
		return await new Appointment(appointmentData).save();
	};
	const getAppointments = async (userId: any, userType: any) => {
		if (userType === 'admin')
			return Appointment.find({ appointmentTo: userId });
		else if (userType === 'customer')
			return Appointment.find({ appointmentFrom: userId });
	};

	const delateAppointment = async (appointmentId: any) => {
		return Appointment.findByIdAndDelete(appointmentId);
	};
	const updateAppointment = async (
		appointmentId: any,
		updateOn: any,
		updateTo: any,
	) => {
		return await Appointment.findByIdAndUpdate(appointmentId, {
			[updateOn]: updateTo,
		});
	};

	return {
		create: createAppointment,
		get: getAppointments,
		delate: delateAppointment,
		update: updateAppointment,
	};
};
