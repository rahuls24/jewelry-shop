import { Price } from './../models/price';
import { Shop } from './../models/shop';

export const adminFunctions = () => {
	const setPrices = async (priceData: any) => {
		const prices = await Price.findByIdAndUpdate(process.env.priceId, {
			gold24: priceData.gold24,
			gold22: priceData.gold22,
			gold18: priceData.gold18,
			sliver: priceData.sliver,
			platinum: priceData.platinum,
		});
		if (prices) return adminFunctions().getPrices();
		return false;
	};
	const getPrices = async () => {
		return Price.findById(process.env.priceId);
	};
	const getShopStatus = async (shouldFetch: string) => {
		const shop = await Shop.findById(process.env.shopId);
		if (shop) {
			switch (shouldFetch) {
				case 'todayOpeningStatus':
					return shop['todayOpeningStatus'];
					break;
				case 'currentStatus':
					return shop['currentStatus'];

				default:
					return -1;
			}
		}
		return -1;
	};
	const setShopStatus = async (shouldChange: string, value: any) => {
		if (
			await Shop.findByIdAndUpdate(process.env.shopId, {
				[shouldChange]: value,
			})
		)
			return adminFunctions().getShopStatus(shouldChange);
	};
	return {
		setPrices,
		getPrices,
		getShopStatus,
		setShopStatus,
	};
};
