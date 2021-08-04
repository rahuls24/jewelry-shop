export interface IMailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
}

export interface IUserFromReqBody {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
}
