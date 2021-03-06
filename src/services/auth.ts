import { randomInt } from 'crypto';
import { User } from './../models/user';
import { Otp } from './../models/otp';
import { createTransport, Transporter } from 'nodemailer';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
	IMailOptions,
	IPayloadForJwt,
	IUserFromReqBody,
} from './../interfaces/auth';
import { sign } from 'jsonwebtoken';
export function commonFunctions() {
	const getUserDetails = async (email: string) => {
		return User.findOne({ email });
	};
	const updateUser = async (
		email: string,
		shouldUpdateDoneIn: string,
		valueUpdateBy: any,
	) => {
		const user = await commonFunctions().getUser(email);
		return User.findByIdAndUpdate(user?._id, {
			[shouldUpdateDoneIn]: valueUpdateBy,
		});
	};
	const deleteUser = async (id: string) => {
		return User.findByIdAndDelete(id);
	};

	const generateHash = (myPlaintextPassword: string): string => {
		const salt: string = genSaltSync(Number(process.env.saltRounds));
		return hashSync(myPlaintextPassword, salt);
	};

	const verifyHash = (myPlaintextPassword: string, hash: string): boolean => {
		return compareSync(myPlaintextPassword, hash);
	};

	const sendMail = async (mailTo: string, mailBody: string) => {
		const emailSenderAuthData = {
			service: 'gmail',
			auth: {
				user: process.env.mail,
				pass: process.env.mailPassword,
			},
		};
		const transporter: Transporter<SMTPTransport.SentMessageInfo> =
			createTransport(emailSenderAuthData);
		const mailOptions: IMailOptions = {
			from: String(process.env.mail),
			to: mailTo,
			subject: `OTP confirmation alert for ${process.env.company}`,
			html: mailBody,
		};
		return transporter.sendMail(mailOptions);
	};

	return {
		getUser: getUserDetails,
		hashPassword: generateHash,
		verifyPassword: verifyHash,
		sendMail,
		deleteUser,
		updateUser,
	};
}

export function signupFunctions() {
	const sendOTP = async (email: string) => {
		const otp: number = randomInt(100000, 999999);
		const mailBody = `<h4>Dear user </h4> <br />
                          <p> Enter the OTP ${otp} for email validation </p>`;

		const sendOtpDetails = await commonFunctions().sendMail(email, mailBody);
		if (sendOtpDetails.accepted) return otp;
	};
	const saveOTP = async (otp: number) => {
		return new Otp({ otp }).save();
	};
	const verifyOTP = async (otpID: string, otp: number) => {
		const otpDetails = await Otp.findById(otpID);
		if (otpDetails?.otp === otp) return true;
		return false;
	};
	const registerUser = async (userData: IUserFromReqBody) => {
		return new User(userData).save();
	};
	const signin = (payload: IPayloadForJwt) => {
		const defaultSecret = 'Not able to find secret from env';
		const secret: string = process.env.passportJwtKey ?? defaultSecret;
		if (secret === defaultSecret) return false;
		return sign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
				data: payload,
			},
			secret,
		);
	};
	return {
		sendOTP,
		saveOTP,
		verifyOTP,
		saveUser: registerUser,
		sign: signin,
	};
}
