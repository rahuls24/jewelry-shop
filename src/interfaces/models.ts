export interface IUser extends Document {
	_id?: any;
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
	profilePic?: string;
	registerOn?: Date;
	__v?: any;
}
export interface IOtp extends Document {
	otp: number;
	generatedAt: Date;
}
