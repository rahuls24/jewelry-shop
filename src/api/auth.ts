const controllerRoute = '/api/auth';
import express, { Request, Response } from 'express';
import { IPayloadForJwt } from '../interfaces/auth';
export const router = express.Router();
import {
	commonFunctions as common,
	signupFunctions as signup,
} from '../services/auth';
import { isEmail, isAllFieldComingFromBody } from '../services/commonFunctions';
import chalk from 'chalk';
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
router.post('/signup', async (req: Request, res: Response) => {
	let newUser = {
		name: req.body.name,
		email: req.body.email,
		phone: req.body.phone,
		password: req.body.password,
		role: req.body.role,
	};
	if (!isAllFieldComingFromBody(newUser))
		return res.status(400).json({
			isSuccess: false,
			error: 'Please provide all required value ',
		});
	try {
		const userDetails = await common().getUser(newUser.email);
		if (userDetails) {
			if (!userDetails.isVerified) await common().deleteUser(userDetails._id);
			else
				return res.status(409).json({
					isSuccess: false,
					error: 'User is already register to user DB',
				});
		}
		if (newUser.password?.length < 6)
			return res.status(400).json({
				isSuccess: false,
				error: 'Password must be of minimum 6 character',
			});
		newUser.password = common().hashPassword(newUser.password);
		const newUserData = await signup().saveUser(newUser);
		if (newUserData)
			return res.status(201).json({
				isSuccess: true,
				userData: newUserData,
			});
		return res.status(500).json({
			isSuccess: false,
			error: ' An unexpected error occurred while registering the user to DB.',
		});
	} catch (error) {
		if (error instanceof Error) {
			const errorMessage = {
				route: controllerRoute + req.route?.path,
				error: error.message,
			};
			console.log(chalk.red(JSON.stringify(errorMessage)));
			return res.status(500).json({
				isSuccess: false,
				error: errorMessage,
			});
		}
	}
});
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/generate-otp'
    @ Route Access => Public
	@ Description => Responsible for generating the Email OTP 

*/
router.post('/generate-otp', async (req: Request, res: Response) => {
	if (!isEmail(req.body.email))
		return res.status(400).json({
			isSuccess: false,
			error: 'Email is not valid',
		});
	try {
		const otp: any = await signup().sendOTP(req.body.email);
		const result = await signup().saveOTP(otp);
		if (result)
			return res.status(200).json({
				isSuccess: true,
				otpDetails: result,
			});
		return res.status(500).json({
			isSuccess: false,
			error:
				'Otp is not generated, Some unexpected error occurred while saving it to in db',
		});
	} catch (error) {
		if (error instanceof Error) {
			const errorMessage = {
				route: controllerRoute + req.route?.path,
				error: error.message,
			};
			console.log(chalk.red(JSON.stringify(errorMessage)));
			return res.status(500).json({
				isSuccess: false,
				error: errorMessage,
			});
		}
	}
});

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/verify-otp'
    @ Route Access => Public
	@ Description => Responsible for verifying the Email OTP

*/
router.post('/verify-otp', async (req: Request, res: Response) => {
	try {
		const reqBodyData = {
			email: req.body.email,
			role: req.body.role,
			optId: req.body.otpId,
			otp: req.body.opt,
		};
		if (!isAllFieldComingFromBody(reqBodyData))
			return res.status(400).json({
				isSuccess: false,
				errorMessage:
					'Provide all three parameter that is email id of user, otpId and opt',
			});
		const result = await signup().verifyOTP(
			reqBodyData.email,
			Number(reqBodyData.otp),
		);
		if (result) {
			await common().updateUser(
				reqBodyData.email,
				reqBodyData.role,
				'isVerified',
				true,
			);
			return res.status(200).json({
				isSuccess: true,
			});
		}
		return res.status(404).json({
			isSuccess: false,
			ErrorMessage: 'Entered OTP is not matched',
		});
	} catch (error) {
		if (error instanceof Error) {
			const errorMessage = {
				route: controllerRoute + req.route?.path,
				error: error.message,
			};
			console.log(chalk.red(JSON.stringify(errorMessage)));
			return res.status(500).json({
				isSuccess: false,
				error: errorMessage,
			});
		}
	}
});

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/verify-otp'
    @ Route Access => Public
	@ Description => Responsible for verifying the Email OTP

*/
router.post('/signin', async (req, res) => {
	let userData = {
		email: req.body.email,
		password: req.body.password,
		role: req.body.role,
	};
	if (!isAllFieldComingFromBody(userData))
		return res.status(400).json({
			isSuccess: false,
			error: 'Please provide all required value ',
		});
	try {
		const userDetails = await common().getUser(userData.email);
		if (userDetails) {
			if (!userDetails.isVerified)
				return res.status(404).json({
					isSuccess: false,
					ErrorMessage: 'User is not found',
				});
			else if (
				common().verifyPassword(userData.password, userDetails.password)
			) {
				const payload: IPayloadForJwt = {
					id: userDetails._id,
					email: userDetails.email,
					name: userDetails.name,
					role: userDetails.role,
				};
				const token = signup().sign(payload);
				if (token)
					return res.status(200).json({
						isSuccess: true,
						berarToken: token,
					});
				else
					return res.status(500).json({
						isSuccess: false,
						errorMessage: 'Something wrong with jwt signin method',
					});
			} else
				return res.status(400).json({
					isSuccess: false,
					errorMessage: 'Wrong password',
				});
		} else
			return res.status(404).json({
				isSuccess: false,
				errorMessage: 'User is not found',
			});
	} catch (error) {
		if (error instanceof Error) {
			const errorMessage = {
				route: controllerRoute + req.route?.path,
				error: error.message,
			};
			console.log(chalk.red(JSON.stringify(errorMessage)));
			return res.status(500).json({
				isSuccess: false,
				error: errorMessage,
			});
		}
	}
});

router.get('/test', async (req, res) => {
	return res.send('working');
});
