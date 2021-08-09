export interface IUser extends Document {
	_id?: string;
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	profilePic: string;
	isVerified: boolean;
	isSignWithOtp: boolean;
	registerOn: Date;
}
export interface IOtp extends Document {
	otp: number;
	generatedAt: Date;
}
export interface IAppointment extends Document {
	appointmentFrom: string;

	appointmentTo: string;

	appointmentDate: Date;
	appointmentDescription: string;
	appointmentPriority: string;
	appointmentState: string;
	appointmentCreatedOn: Date;
}

export interface IPrice extends Document {
	gold24: number;
	gold22: number;
	gold18: number;
	sliver: number;
	platinum: number;
}
