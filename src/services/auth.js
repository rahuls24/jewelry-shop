const User = require('../models/user');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
const OTP = require('../models/otp');

/**
 * This function is responsible for returning all common functions
 * 	@type {{email: string}=> boolean}
 **/
function commonFunctions() {
	/**
	 * This function is responsible for checking user is already having an account with given email or not
	 *	@params email {string} Email by which user want to register
	 *  @returns {boolean}  True if user is already registered
	 * 	@type {{email: string}=> boolean}
	 **/
	const isUserPresent = (email) => {
		return new Promise((resolve, reject) => {
			User.findOne({ email: email })
				.then((user) => {
					if (user) {
						return resolve(true);
					}
					return resolve(false);
				})
				.catch((err) => {
					console.log(err);
				});
		});
	};
	/**
	 * This function is responsible for creating hash of a plain text password
	 *	@params myPlaintextPassword {string} It is plain password for which hash will created
	 *  @returns {string}  A hash of a plain text
	 * 	@type {{myPlaintextPassword: string}=> string}
	 **/
	const generateHash = (myPlaintextPassword) => {
		const salt = bcrypt.genSaltSync(Number(process.env.saltRounds));
		return bcrypt.hashSync(myPlaintextPassword, salt);
	};

	/**
	 * This function is responsible for verifying the password
	 *	@params myPlaintextPassword {string} It is plain password entered by user
	 *  @params hash {string} It is hash value of plain password stored in DB
	 *  @returns {boolean}  True if password will matched
	 *  @type {{myPlaintextPassword: string,hash:string}=> boolean}
	 **/
	const verifyHash = (myPlaintextPassword, hash) => {
		return bcrypt.compareSync(myPlaintextPassword, hash);
	};
	const sendMail = async (mailTo, mailBody, otp = 'NO OTP') => {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.mail,
				pass: process.env.mailPassword,
			},
		});
		var mailOptions = {
			from: process.env.mail,
			to: mailTo,
			subject: `OTP confirmation alert for ${process.env.company}`,
			html: mailBody,
		};
		return new Promise((resolve, reject) => {
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					return reject('Not able to send mail');
				} else {
					if (otp !== 'NO OTP') {
						return resolve(otp);
					}
					return resolve(true);
				}
			});
		});
	};

	return {
		isUser: isUserPresent,
		hashPassword: generateHash,
		verifyPassword: verifyHash,
		sendMail: sendMail,
	};
}

function signupFunctions() {
	const sendOTP = (email) => {
		const otp = Math.floor(100000 + Math.random() * 900000);
		const mailBody = `<h4>Dear user </h4> <br />
                          <p> Enter the OTP ${otp} for email validation </p>`;
		return commonFunctions().sendMail(email, mailBody, otp);
	};
	const saveOTP = async (otp) => {
		const newOTP = new OTP({
			otp: otp,
		});
		return new Promise((resolve, reject) => {
			newOTP
				.save()
				.then((result) => {
					if (result) {
						return resolve({
							otpID: result._id,
							otp: otp,
						});
					}
					return reject('Error in saving OTP in DB');
				})
				.catch((err) => {
					console.log('error occurred while saving OTP in DB' + err);
					return reject(err);
				});
		});
	};
	const verifyOTP = async (otpID, otp) => {
		return new Promise((resolve, reject) => {
			OTP.findById(otpID)
				.then((res) => {
					if (res) {
						if (res.otp === otp) {
							return resolve(true);
						}
						return reject('Not is not matched');
					}
					return reject('Not is not matched');
				})
				.catch((err) => {
					console.log('Error occured while matching the OTP' + err);
					return reject(err);
				});
		});
	};
	const registerUser = (userData) => {
		return new Promise((resolve, reject) => {
			userData.password = commonFunctions().hashPassword(userData.password);
			const newUser = User(userData);
			newUser
				.save()
				.then((user) => {
					if (user) {
						return resolve(user);
					}
					return reject(err);
				})
				.catch((err) => {
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

module.exports = {
	common: commonFunctions(),
	signup: signupFunctions(),
};
