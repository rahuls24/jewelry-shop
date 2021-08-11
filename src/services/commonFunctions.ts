import validator from 'validator';
import date from 'date-and-time';
import fs from 'fs';
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

export const isBoolean = (item: any): boolean => {
	return validator.isBoolean(item);
};

export const isNumber = (item: any): boolean => {
	return validator.isNumeric(item);
};

export const isString = (item: any): boolean => {
	return validator.isAlpha(item);
};
export const isMongoId = (item: any): boolean => {
	return validator.isMongoId(item);
};

export const addDaysFromToday = (days: number): Date => {
	return date.addDays(new Date(), days);
};

export const delateFile = (path: any) => {
	try {
		fs.unlinkSync(path);
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};
