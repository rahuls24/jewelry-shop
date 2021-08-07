import { Users as User } from './../models/user';
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
import passport from 'passport';

export function commonFunctions() {
	// const isUserPresent = async (email: string) => {
	// 	return await User.findOne({ email: email });
	// };

	const getUserDetails = async (email: string) => {
		return await User.findOne({ email: email });
	};
	const deleteUser = async (id: string) => {
		return await User.findByIdAndDelete(id);
	};

	const generateHash = (myPlaintextPassword: string): string => {
		const salt: string = genSaltSync(Number(process.env.saltRounds));
		return hashSync(myPlaintextPassword, salt);
	};

	const verifyHash = (myPlaintextPassword: any, hash: any): boolean => {
		console.log(myPlaintextPassword, hash);
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
		return await transporter.sendMail(mailOptions);
	};

	return {
		getUser: getUserDetails,
		hashPassword: generateHash,
		verifyPassword: verifyHash,
		sendMail: sendMail,
		deleteUser: deleteUser,
	};
}

export function signupFunctions() {
	const sendOTP = async (email: string) => {
		const otp: number = Math.floor(100000 + Math.random() * 900000);
		const mailBody = `<h4>Dear user </h4> <br />
                          <p> Enter the OTP ${otp} for email validation </p>`;

		const sendOtpDetails = await commonFunctions().sendMail(email, mailBody);
		if (sendOtpDetails.accepted) return otp;
	};
	const saveOTP = async (otp: number) => {
		const newOTP = new Otp({
			otp: otp,
			failTest: 'reason for fail',
		});
		return await newOTP.save();
	};
	const verifyOTP = async (otpID: string, otp: number) => {
		const otpDetails = await Otp.findById(otpID);
		if (otpDetails?.otp === otp) return true;
		return false;
	};
	const registerUser = async (userData: IUserFromReqBody) => {
		return await new User(userData).save();
	};
	const signin = (payload: IPayloadForJwt) => {
		const secret: string =
			process.env.passportJwtKey ?? 'Not able to find secret from env';
		if (secret === 'Not able to find secret from env') return false;
		return sign(
			{
				exp: Math.floor(Date.now() / 1000) + 60 * 60,
				data: payload,
			},
			secret,
		);
	};
	return {
		sendOTP: sendOTP,
		saveOTP: saveOTP,
		verifyOTP: verifyOTP,
		saveUser: registerUser,
		sign: signin,
	};
}
