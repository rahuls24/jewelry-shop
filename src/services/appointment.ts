import { Appointment } from './../models/appointment';

//TODO: We have to implement function in which only appointment owner can modify and watch the appointment
export const commonAppointmentFunctions = () => {
	const createAppointment = async (appointmentData: any) => {
		return await new Appointment(appointmentData).save();
	};
	const getAppointments = async (userId: string, userType: string) => {
		if (userType === 'admin')
			return Appointment.find({ appointmentTo: userId });
		else if (userType === 'customer')
			return Appointment.find({ appointmentFrom: userId });
	};
	const getAppointmentById = async (appointmentId: string) => {
		return await Appointment.findById(appointmentId);
	};

	const delateAppointment = async (appointmentId: string) => {
		return Appointment.findByIdAndDelete(appointmentId);
	};
	const updateAppointment = async (
		appointmentId: string,
		updateOn: string,
		updateTo: any,
	) => {
		const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
			[updateOn]: updateTo,
		});
		return await commonAppointmentFunctions().getById(appointment?._id);
	};

	return {
		create: createAppointment,
		get: getAppointments,
		getById: getAppointmentById,
		delate: delateAppointment,
		update: updateAppointment,
	};
};
