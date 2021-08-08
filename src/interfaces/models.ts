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
