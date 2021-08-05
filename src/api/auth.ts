const controllerRoute: string = '/api/auth';
import express, { Request, Response } from 'express';
import { IUserFromReqBody } from '../interfaces/auth';
export const authRouter = express.Router();
import {
	commonFunctions as common,
	signupFunctions as signup,
} from '../services/auth';
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/signup'
    @ Route Access => Public
	@ Description => Responsible for handle register a user

*/
authRouter.post('/signup', async (req: Request, res: Response) => {
	const isUser: boolean = await common().isUser(req.body.email);
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
		errorMsg: 'An unexpected error occurred while registering the user to DB',
	});

	// common()
	// 	.isUser(req.body.email)
	// 	.then(async (result: boolean) => {
	// 		if (result) {
	// 			return res.status(409).json({
	// 				isSuccess: false,
	// 				errorMsg: 'User is already register to user DB',
	// 			});
	// 		}
	// 		const newUser: IUserFromReqBody = {
	// 			name: req.body.name,
	// 			email: req.body.email,
	// 			phone: req.body.phone,
	// 			password: req.body.password,
	// 			role: req.body.role,
	// 		};
	// 		try {
	// 			const user: IUser | string = await signup().saveUser(newUser);
	// 			res.status(200).json({
	// 				isSuccess: true,
	// 				userData: user,
	// 			});
	// 		} catch (err) {
	// 			console.log(
	// 				'Error occurred while registering the user Route - /api/auth/signup POST',
	// 				err,
	// 			);
	// 			return res.status(500).json({
	// 				isSuccess: false,
	// 				errorMsg: `Error occurred while registering the user Route. Error=> ${err}`,
	// 			});
	// 		}
	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 		return res.status(500).json({
	// 			isSuccess: false,
	// 			errorMsg: `Error occurred while finding the user in DB before registering. Error=> ${err}`,
	// 		});
	// 	});
});
/*

    @ Route Type => Post
    @ Route Address => '/api/auth/generate-otp'
    @ Route Access => Public
	@ Description => Responsible for generating the Email OTP 

*/
authRouter.post('/generate-otp', async (req: Request, res: Response) => {
	try {
		const otp: any = await signup().sendOTP(req.body.email);
		const result = await signup().saveOTP(otp);
		if (result)
			return res.status(200).json({
				isSuccess: true,
				otpDetails: result,
			});
		return res.status(200).json({
			isSuccess: false,
			ErrorMessage:
				'Otp is not generated, Some unexpected error occurred while saving it to in db',
		});
	} catch (error) {
		let errorMessage = {
			route: controllerRoute + req.route?.path,
			error: error,
		};
		console.log(errorMessage);
		return res.status(500).json({
			isSuccess: false,
			ErrorMessage:
				'Otp is not generated, Some unexpected error occurred while saving it to in db',
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
	const result = await signup().verifyOTP(req.body.otpID, Number(req.body.otp));
	console.log(result, 'res');
	if (result)
		return res.status(200).json({
			isSuccess: true,
		});
	return res.status(500).json({
		isSuccess: false,
		ErrorMessage:
			'Otp is not generated, Some unexpected error occurred while verifying otp 0',
	});
});

authRouter.get('/test', async (req, res) => {
	const user = await common().isUser('rahul@gmail.com');
	console.log(1);
	console.log(user);
	res.send(user);
});
