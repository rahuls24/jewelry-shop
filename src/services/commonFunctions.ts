import validator from 'validator';
import date from 'date-and-time';
import fs from 'fs';
import { Request, Response } from 'express';
import chalk from 'chalk';

export const typeChecker = () => {
	const isEmail = (email: string): boolean => {
		return validator.isEmail(email);
	};
	const isDate = (email: string): boolean => {
		return validator.isDate(email);
	};
	const isBoolean = (item: string): boolean => {
		return validator.isBoolean(item);
	};
	const isNumber = (item: string): boolean => {
		return validator.isNumeric(item);
	};
	const isString = (item: string): boolean => {
		return validator.isAlpha(item);
	};
	const isMongoId = (item: string): boolean => {
		return validator.isMongoId(item);
	};
	const isAllFieldComingFromBody = (fieldsValue: any): boolean => {
		if (
			Object.keys(fieldsValue).length === 0 &&
			fieldsValue.constructor === Object
		)
			return false;
		for (const property in fieldsValue) {
			if (!fieldsValue[property]) return false;
		}
		return true;
	};
	return {
		isEmail,
		isDate,
		isBoolean,
		isNumber,
		isString,
		isMongoId,
		isAllFieldComingFromBody,
	};
};
export const dateHandler = () => {
	const addDaysFromToday = (days: number): Date => {
		return date.addDays(new Date(), days);
	};
	return {
		addDaysFromToday,
	};
};
export const fileHandler = () => {
	const delateFile = (path: string): boolean => {
		try {
			fs.unlinkSync(path);
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};
	return {
		delateFile,
	};
};
export const errorHandler = () => {
	const catchBlockHandler = (
		req: Request,
		res: Response,
		error: any,
		controllerRoute: string,
	) => {
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
	};
	return {
		catchBlockHandler,
	};
};

export const httpStatus = () => {
	return {
		ok: 200,
		created: 201,
		accepted: 202,
		movedPermanently: 301,
		badRequest: 400,
		unauthorized: 401,
		paymentRequired: 402,
		forbidden: 403,
		notFound: 404,
		notAcceptable: 406,
		requestTimeout: 408,
		conflict: 409,
		internalServerError: 500,
		notImplemented: 501,
	};
};
