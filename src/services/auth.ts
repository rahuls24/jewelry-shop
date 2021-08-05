import { Users as User } from './../models/user';
import { Otp } from './../models/otp';
import { createTransport, Transporter } from 'nodemailer';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IMailOptions, IUserFromReqBody } from './../interfaces/auth';
import { IUser } from './../interfaces/models';

//test
const test = 'test';
export function commonFunctions() {
	const isUserPresent = async (email: string) => {
		try {
			return await User.findOne({ email: email });
		} catch (error) {
			console.log(error);
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
		const transporter: Transporter<SMTPTransport.SentMessageInfo> =
			createTransport({
				service: 'gmail',
				auth: {
					user: process.env.mail,
					pass: process.env.mailPassword,
				},
			});
		var mailOptions: IMailOptions = {
			from: String(process.env.mail),
			to: mailTo,
			subject: `OTP confirmation alert for ${process.env.company}`,
			html: mailBody,
		};
		return await transporter.sendMail(
			mailOptions,
			(error: Error | null, info) => {
				if (error) {
					console.log(error);
					return false;
				} else {
					if (otp !== 'NO OTP') {
						return otp;
					}
					return otp;
				}
			},
		);
		// return new Promise((resolve, reject) => {
		// 	transporter.sendMail(mailOptions, (error: Error | null, info) => {
		// 		if (error) {
		// 			console.log(error);
		// 			return reject('Not able to send mail');
		// 		} else {
		// 			if (otp !== 'NO OTP') {
		// 				return resolve(otp);
		// 			}
		// 			return resolve(true);
		// 		}
		// 	});
		// });
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
		return await commonFunctions().sendMail(email, mailBody, otp);
	};
	const saveOTP = async (otp: number): Promise<string | object> => {
		const newOTP = new Otp({
			otp: otp,
		});
		return new Promise((resolve, reject) => {
			newOTP
				.save()
				.then(result => {
					if (result) {
						return resolve({
							otpID: result._id,
							otp: otp,
						});
					}
					return reject('Error in saving OTP in DB');
				})
				.catch(err => {
					console.log('error occurred while saving OTP in DB' + err);
					return reject(err);
				});
		});
	};
	const verifyOTP = async (
		otpID: string,
		otp: number,
	): Promise<boolean | string> => {
		return new Promise((resolve, reject) => {
			Otp.findById(otpID)
				.then(res => {
					if (res) {
						if (res.otp === otp) {
							return resolve(true);
						}
						return reject('Not is not matched');
					}
					return reject('Not is not matched');
				})
				.catch(err => {
					console.log('Error occured while matching the OTP' + err);
					return reject(err);
				});
		});
	};
	const registerUser = (
		userData: IUserFromReqBody,
	): Promise<IUser | string> => {
		return new Promise((resolve, reject) => {
			if (userData.password.length < 6) {
				reject('Password length must be grater than 5 character');
			}
			userData.password = commonFunctions().hashPassword(userData.password);
			const newUser = new User(userData);
			newUser
				.save()
				.then((user: IUser) => {
					if (user) {
						return resolve(user);
					}
					return reject(user);
				})
				.catch(err => {
					console.log(err);
					return reject(err);
				});
		});
	};
	return {
		sendOTP: sendOTP,
		saveOTP: saveOTP,
		verifyOTP: verifyOTP,
		saveUser: registerUser,
	};
}
