const controllerRoute = '/api/auth';
import express, { Request, Response } from 'express';
import { IPayloadForJwt, IUserFromReqBody } from '../interfaces/auth';
export const router = express.Router();
import {
	commonFunctions as common,
	signupFunctions as signup,
} from '../services/auth';
import { isValidEmail } from '../services/commonFunctions';
import { parse } from 'error-stack-parser';
import passport from 'passport';
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
router.post('/signup', async (req: Request, res: Response) => {
	try {
		const userDetails = await common().getUser(req.body.email, req.body.role);
		if (userDetails) {
			if (!userDetails.isVerified) await common().deleteUser(userDetails._id);
			else
				return res.status(409).json({
					isSuccess: false,
					errorMsg: 'User is already register to user DB',
				});
		}
		if (req.body.password?.length < 6)
			return res.status(400).json({
				isSuccess: false,
				errorMsg: 'Password must be of minimum 6 character',
			});
		const newUser: IUserFromReqBody = {
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: common().hashPassword(req.body.password),
			role: req.body.role,
		};
		const newUserData = await signup().saveUser(newUser);
		if (newUserData)
			return res.status(201).json({
				isSuccess: true,
				userData: newUserData,
			});
		return res.status(500).json({
			isSuccess: false,
			errorMsg:
				' An unexpected error occurred while registering the user to DB.',
		});
	} catch (error) {
		const errorMessage = {
			route: controllerRoute + req.route?.path,
			error: error,
		};
		console.log(errorMessage);
		return res.status(400).json({
			isSuccess: false,
			errorMsg:
				'An unexpected error occurred while registering the user to DB. Error => ',
			error: error,
		});
	}
});
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/generate-otp'
    @ Route Access => Public
	@ Description => Responsible for generating the Email OTP 

*/
router.post('/generate-otp', async (req: Request, res: Response) => {
	if (!isValidEmail(req.body.email))
		return res.status(500).json({
			isSuccess: false,
			ErrorMessage: 'Email is not valid',
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
			ErrorMessage:
				'Otp is not generated, Some unexpected error occurred while saving it to in db',
		});
	} catch (error) {
		const errorMessage = {
			route: controllerRoute + req.route?.path,
			error: error,
		};
		console.log(errorMessage);
		return res.status(400).json({
			isSuccess: false,
			ErrorMessage:
				'Otp is not generated, Some unexpected error occurred while saving it to in db',
			error: errorMessage,
		});
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
		console.log(reqBodyData);
		if (!reqBodyData.email || !reqBodyData.optId || !reqBodyData.otp)
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
		const errorMessage = {
			isSuccess: false,
			route: controllerRoute + req.route?.path,
			error: error,
		};
		console.log(errorMessage);
		return res.status(500).json({
			isSuccess: false,
			errorMessage:
				'Otp is not generated, Some unexpected error occurred while verifying otp',
			error: errorMessage,
		});
	}
});

/*

    @ Route Type => Post
    @ Route Address => '/api/auth/verify-otp'
    @ Route Access => Public
	@ Description => Responsible for verifying the Email OTP

*/
router.post('/signin', async (req, res) => {
	try {
		const userDetails = await common().getUser(req.body.email, req.body.role);
		if (userDetails) {
			if (!userDetails.isVerified)
				return res.status(404).json({
					isSuccess: false,
					ErrorMessage: 'User is not found',
				});
			else if (
				common().verifyPassword(req.body.password, userDetails.password)
			) {
				const payload: IPayloadForJwt = {
					id: userDetails._id,
					email: userDetails.email,
					name: userDetails.name,
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
			console.log(parse(error));
			const errorMessage = {
				isSuccess: false,
				route: controllerRoute + req.route?.path,
				error: error.message,
			};
			return res.status(500).json(errorMessage);
		}
	}
});

router.get(
	'/test',
	passport.authenticate('admin', { session: false }),
	async (req, res) => {
		if (req.user) {
			const user: any = req.user;
			console.log(user._id);
		}
		return res.send('working');
	},
);
