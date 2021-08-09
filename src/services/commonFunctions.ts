import validator from 'validator';
export const isValidEmail = (email: string): boolean => {
	return validator.isEmail(email);
};
export const isValidDate = (email: string): boolean => {
	return validator.isDate(email);
};

export const isAllFieldComingFromBody = (fieldsValue: any): boolean => {
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
