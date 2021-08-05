import { Users as User } from './../models/user';
import { Otp } from './../models/otp';
import { createTransport, Transporter } from 'nodemailer';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailOptions, IUserFromReqBody } from './../interfaces/auth';

//test
const test = 'test';
export function commonFunctions() {
	const isUserPresent = async (email: string) => {
		try {
			const result = await User.findOne({ email: email });
			if (result) return true;
			return false;
		} catch (error) {
			console.log(
				`error occurred when we are trying to fetch user from db in using isUserPresent function of commonFunction from controller auth.ts and Error is => ${error} `,
			);
			return false;
		}
	};

	const generateHash = (myPlaintextPassword: string): string => {
		const salt: string = genSaltSync(Number(process.env.saltRounds));
		return hashSync(myPlaintextPassword, salt);
	};

	const verifyHash = (myPlaintextPassword: string, hash: string): boolean => {
		return compareSync(myPlaintextPassword, hash);
	};

	const sendMail = async (
		mailTo: string,
		mailBody: string,
		otp: string | number = 'NO OTP',
	) => {
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
		isUser: isUserPresent,
		hashPassword: generateHash,
		verifyPassword: verifyHash,
		sendMail: sendMail,
	};
}

export function signupFunctions() {
	const sendOTP = async (email: string) => {
		const otp: number = Math.floor(100000 + Math.random() * 900000);
		const mailBody: string = `<h4>Dear user </h4> <br />
                          <p> Enter the OTP ${otp} for email validation </p>`;

		const sendOtpDetails = await commonFunctions().sendMail(
			email,
			mailBody,
			otp,
		);
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
		try {
			const otpDetails = await Otp.findById({ sd: 'dd' });
			if (otpDetails?.otp === otp) return true;
			return false;
		} catch (error) {
			console.log(
				`An Exception is caused while finding the opt in db durning verifying. Error => ${error}`,
			);
			return false;
		}
	};
	const registerUser = async (userData: IUserFromReqBody) => {
		try {
			const newUserData = await new User(userData).save();
			if (newUserData) return newUserData;
			return false;
		} catch (error) {
			console.log(
				`An error is occurred while saving the user to db. Error => ${error}`,
			);
			return false;
		}
	};
	return {
		sendOTP: sendOTP,
		saveOTP: saveOTP,
		verifyOTP: verifyOTP,
		saveUser: registerUser,
	};
}
