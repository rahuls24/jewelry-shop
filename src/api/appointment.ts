const controllerRoute = '/api/appointment';
import express, { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
export const router = express.Router();
import passport from 'passport';
import isDate from 'validator/lib/isDate';
import { commonAppointmentFunctions } from './../services/appointment';
import { isAllFieldComingFromBody } from './../services/commonFunctions';
import chalk from 'chalk';
/*
    @ Route Type => POST
    @ Route Address => '"/create"'
    @ Route Access => Private(customer)
    @ Description => A route for creating an appointment by user
	@params => appointmentTo,appointmentDate,appointmentDescription
*/
router.post(
	'/create',
	passport.authenticate('customer', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const currentUser: any = req.user;
			const appointmentData = {
				appointmentFrom: currentUser._id,
				appointmentTo: req.body.appointmentTo,
				appointmentDate: req.body.appointmentDate,
				appointmentDescription: req.body.appointmentDescription,
			};
			if (!isAllFieldComingFromBody(appointmentData))
				return res.status(400).json({
					isSuccess: false,
					errorMessage: 'Please provide all required details ',
				});
			if (!isDate(appointmentData.appointmentDate))
				return res.status(400).json({
					isSuccess: false,
					errorMessage: 'Please provide a valid date details ',
				});
			const newAppointmentData = await commonAppointmentFunctions().create(
				appointmentData,
			);
			if (newAppointmentData)
				return res.status(201).json({
					isSuccess: true,
					appointment: newAppointmentData,
				});
			else
				return res.status(500).json({
					isSuccess: true,
					errorMessage:
						'An unexpected error occurred while saving the appointment in DB',
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
	},
);

/*
	@ Route Type => GET
	@ Route Address => '/get-all-appointment'
	@ Route Access => Private
	@ Description => A route for get all the appointment
	@params => Noting is needed 
*/
router.get(
	'/get-all-appointment',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		try {
			const currentUser: any = req.user;
			const role: string = currentUser.role;
			let appointments;
			switch (role) {
				case 'admin':
					appointments = await commonAppointmentFunctions().get(
						currentUser._id,
						'admin',
					);
					break;
				case 'customer':
					appointments = await commonAppointmentFunctions().get(
						currentUser._id,
						'customer',
					);
					break;
				default:
					return res.status(400).json({
						isSuccess: false,
						errorMessage: 'Please provide a valid user role type',
					});
					break;
			}
			if (appointments)
				return res.status(200).json({
					isSuccess: true,
					appointments,
				});
			return res.status(404).json({
				isSuccess: false,
				errorMessage: 'No record found',
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
	},
);

/*
	@ Route Type => GET
	@ Route Address => '/get-appointment/:appointmentId'
	@ Route Access => Private
	@ Description => A route for get a specific appointment
	@params => Mention in url
*/
router.get(
	'/get-appointment/:appointmentId',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		if (!isValidObjectId(req.params.appointmentId))
			return res.status(400).json({
				isSuccess: false,
				errorMessage:
					'Please provide a valid appointment id that need to get data',
			});
		try {
			const appointment = await commonAppointmentFunctions().getById(
				req.params.appointmentId,
			);
			if (appointment)
				return res.status(200).json({
					isSuccess: true,
					appointment,
				});
			return res.status(404).json({
				isSuccess: false,
				errorMessage: 'No record found with give id',
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
	},
);

/*
	@ Route Type => POST
	@ Route Address => '/confirm-appointment'
	@ Route Access => Private
	@ Description => A route for confirming the appointment
*/
router.post(
	'/confirm-appointment',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			if (!isValidObjectId(req.body.appointmentId))
				return res.status(400).json({
					isSuccess: false,
					errorMessage:
						'Please provide a valid appointment id that need to change',
				});
			const appointment = await commonAppointmentFunctions().update(
				req.body.appointmentId,
				'appointmentState',
				'confirm',
			);
			if (appointment)
				return res.status(200).json({
					isSuccess: true,
					appointment,
				});
			return res.status(404).json({
				isSuccess: false,
				errorMessage: 'No record found with give id',
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
	},
);
