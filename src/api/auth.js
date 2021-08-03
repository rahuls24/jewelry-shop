const express = require('express');
const router = express.Router();
const authFunctions = require('../services/auth');

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
router.post('/signup', async (req, res) => {
	authFunctions.common
		.isUser(req.body.email)
		.then(async (result) => {
			if (result) {
				return res.status(409).json({
					isSuccess: false,
					errorMsg: 'User is already register to user DB',
				});
			}
			const newUser = {
				name: req.body.name,
				email: req.body.email,
				phone: req.body.phone,
				password: req.body.password,
				role: req.body.role,
			};
			try {
				const user = await authFunctions.signup.saveUser(newUser);
				res.status(200).json({
					isSuccess: true,
					userData: user,
				});
			} catch (err) {
				console.log(
					'Error occurred while registering the user Route - /api/auth/signup POST',
					err,
				);
				return res.status(500).json({
					isSuccess: false,
					errorMsg: `Error occurred while registering the user Route. Error=> ${err}`,
				});
			}
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				isSuccess: false,
				errorMsg: `Error occurred while finding the user in DB before registering. Error=> ${err}`,
			});
		});
});
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/generate-otp'
    @ Route Access => Public
	@ Description => Responsible for generating the Email OTP

*/
router.post('/generate-otp', async (req, res) => {
	try {
		const otp = await authFunctions.signup.sendOTP(req.body.email);
		const result = await authFunctions.signup.saveOTP(otp.otp);
		res.status(200).json({
			isSuccess: true,
			otpDetails: result,
		});
	} catch (err) {
		console.log('Error found while creating Email OTP', err);
		res.status(500).json({
			isSuccess: false,
			errorMsg: `Error found while creating Email OTP. Error=> ${err}`,
		});
	}
});

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/verify-otp'
    @ Route Access => Public
	@ Description => Responsible for verifying the Email OTP

*/
router.post('/verify-otp', async (req, res) => {
	try {
		const result = await authFunctions.signup.verifyOTP(
			req.body.otpID,
			Number(req.body.otp),
		);
		res.json(result);
	} catch (error) {
		console.log(error);
		res.json(error);
	}
});
module.exports = router;
