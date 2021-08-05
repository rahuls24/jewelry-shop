import express, { Request, Response } from 'express';
import { IUserFromReqBody } from '../interfaces/auth';
import { IUser } from '../interfaces/models';
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
		console.log(1);
		const otp: any = await signup().sendOTP(req.body.email);
		console.log(otp);
		res.send(otp);
		// const result = await signup().saveOTP(Number(otp));
		// res.status(200).json({
		// 	isSuccess: true,
		// 	otpDetails: result,
		// });
	} catch (err) {
		// console.log('Error found while creating Email OTP', err);
		// res.status(500).json({
		// 	isSuccess: false,
		// 	errorMsg: `Error found while creating Email OTP. Error=> ${err}`,
		// });
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
		res.json(result);
	} catch (error) {
		console.log(error);
		res.json(error);
	}
});

authRouter.get('/test', async (req, res) => {
	const user = await common().isUser('rahul@gmail.com');
	console.log(1);
	console.log(user);
	res.send(user);
});
