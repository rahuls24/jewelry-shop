export interface IUser extends Document {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	profilePic: string;
	isVerified: boolean;
	registerOn: Date;
}
export interface IOtp extends Document {
	otp: number;
	generatedAt: Date;
}
