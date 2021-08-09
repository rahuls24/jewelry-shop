import express, { Request, Response } from 'express';
export const router = express.Router();
import passport from 'passport';
import { parse } from 'error-stack-parser';
import isDate from 'validator/lib/isDate';
import { commonAppointmentFunctions } from './../services/appointment';
import { isAllFieldComingFromBody } from './../services/commonFunctions';
/*

    @ Route Type => Post
    @ Route Address => '"/create"'
    @ Route Access => Private
    @ Description => A route for creating an appointment 

*/
router.post(
	'/create',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
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
			if (!isDate(req.body.appointmentDate))
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
					appointmentData: newAppointmentData,
				});
			else
				return res.status(500).json({
					isSuccess: true,
					errorMessage:
						'An unexpected error occurred while saving the appointment in DB',
				});
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
				return res.status(500).json({
					isSuccess: false,
					errorMessage: error.message,
				});
			}
		}
	},
);
