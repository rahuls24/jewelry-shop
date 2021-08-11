import validator from 'validator';
import date from 'date-and-time';
import fs from 'fs';
import { Request, Response } from 'express';
import chalk from 'chalk';
export const isEmail = (email: string): boolean => {
	return validator.isEmail(email);
};
export const isValidDate = (email: string): boolean => {
	return validator.isDate(email);
};

export const isAllFieldComingFromBody = (fieldsValue: any): boolean => {
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

export const isBoolean = (item: string): boolean => {
	return validator.isBoolean(item);
};

export const isNumber = (item: string): boolean => {
	return validator.isNumeric(item);
};

export const isString = (item: string): boolean => {
	return validator.isAlpha(item);
};
export const isMongoId = (item: string): boolean => {
	return validator.isMongoId(item);
};

export const addDaysFromToday = (days: number): Date => {
	return date.addDays(new Date(), days);
};

export const delateFile = (path: string): boolean => {
	try {
		fs.unlinkSync(path);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const errorHandler = (
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
