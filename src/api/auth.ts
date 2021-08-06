const controllerRoute = '/api/auth';
import express, { Request, Response } from 'express';
import { IUserFromReqBody } from '../interfaces/auth';
export const authRouter = express.Router();
import {
	commonFunctions as common,
	signupFunctions as signup,
} from '../services/auth';
import { isValidEmail } from '../services/commonFunctions';
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
authRouter.post('/signup', async (req: Request, res: Response) => {
	try {
		const isUser = await common().isUser(req.body.email);
		if (isUser)
			return res.status(409).json({
				isSuccess: false,
				errorMsg: 'User is already register to user DB',
			});
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
authRouter.post('/generate-otp', async (req: Request, res: Response) => {
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
authRouter.post('/verify-otp', async (req: Request, res: Response) => {
	try {
		const result = await signup().verifyOTP(
			req.body.otpID,
			Number(req.body.otp),
		);
		if (result)
			return res.status(200).json({
				isSuccess: true,
			});
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
authRouter.post('/signin', async (req, res) => {
	try {
		const isUserPresent = await common().isUser(req.body.email);
		if (isUserPresent) {
			const userDetails = await common().getUserDetails(req.body.email);
			if (
				userDetails &&
				common().verifyPassword(req.body.email, userDetails.password)
			) {
				console.log(userDetails);
				return res.status(200).json({
					isSuccess: true,
				});
			}
		} else {
			return res.status(404).json({
				isSuccess: false,
				ErrorMessage: 'User is not found',
			});
		}
	} catch (error) {
		console.log(error, 'err--------------------');
		return res.send(error);
	}
});

authRouter.get('/test', async (req, res) => {
	const user = await common().isUser('rahul@gmail.com');
	console.log(1);
	console.log(user);
	res.send(user);
});
