import { Price } from './../models/price';

export const adminFunctions = () => {
	const setPrices = async (priceData: any) => {
		const prices = await Price.findByIdAndUpdate(process.env.priceId, {
			gold24: priceData.gold24,
			gold22: priceData.gold22,
			gold18: priceData.gold18,
			sliver: priceData.sliver,
			platinum: priceData.platinum,
		});
		if (prices) return await adminFunctions().getPrices();
		return false;
	};
	const getPrices = async () => {
		return await Price.findById(process.env.priceId);
	};

	return {
		setPrices: setPrices,
		getPrices: getPrices,
	};
};
