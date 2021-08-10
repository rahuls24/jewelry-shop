const controllerRoute = '/api/admin';
import express, { Request, Response } from 'express';
import chalk from 'chalk';
import { adminFunctions } from './../services/admin';
import {
	isAllFieldComingFromBody,
	isBoolean,
} from './../services/commonFunctions';
import passport from 'passport';
export const router = express.Router();

/*

    @ Route Type => POST
    @ Route Address => '"/set-prices"'
    @ Route Access => Private (Only for admin)
    @ Description => A route for setting the price

*/
router.post(
	'/set-price',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const previousPriceData: any = await adminFunctions().getPrices();
			const currentPriceData: any = {};
			let priceList: any = process.env.priceAvailable?.split('+');
			console.log(priceList);
			console.log(req.body, '0');
			for (const key in req.body) {
				currentPriceData[key] = Number(req.body[key]);
			}
			console.log(currentPriceData, '1');
			if (!isAllFieldComingFromBody(currentPriceData))
				return res.status(400).json({
					isSuccess: false,
					error: 'Please give value for which you want to change the price',
				});
			for (let index = 0; index < priceList.length; index++) {
				if (!(priceList[index] in currentPriceData))
					currentPriceData[priceList[index]] =
						previousPriceData[priceList[index]];
			}
			console.log(currentPriceData, previousPriceData);
			for (const key in currentPriceData) {
				if (!(key in previousPriceData))
					return res.status(404).json({
						isSuccess: false,
						error: 'Please give correct attribute ',
					});
			}
			const newPrice = await adminFunctions().setPrices(currentPriceData);
			if (newPrice)
				return res.status(200).json({
					isSuccess: true,
					prices: newPrice,
				});
			return res.status(404).json({
				isSuccess: false,
				error:
					'There is some unexpected error occurred while updating of getting the price from db',
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
    @ Route Address => '/get-price'
    @ Route Access => Private
    @ Description => A route for get the price  list

*/
router.get(
	'/get-price',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const prices = await adminFunctions().getPrices();
			if (prices)
				return res.status(200).json({
					isSuccess: true,
					prices: prices,
				});
			return res.json(404).json({
				isSuccess: false,
				error: 'No price list present in DB',
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
    @ Route Address => '/set-shop-status/:shouldUpdate/:shouldUpdateTo'
    @ Route Access => Private
    @ Description => A route for setting shop status

*/

router.get(
	'/set-shop-status/:shouldUpdate/:shouldUpdateTo',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		const params = {
			shouldUpdate: req.params.shouldUpdate,
			shouldUpdateTo: req.params.shouldUpdateTo,
		};
		if (!isBoolean(params.shouldUpdateTo))
			return res.status(400).json({
				isSuccess: false,
				error: 'Please give boolean value to change the status',
			});
		try {
			const shouldChange = req.params.shouldUpdate;
			let status;
			switch (shouldChange) {
				case 'todayOpeningStatus':
					status = await adminFunctions().setShopStatus(
						'todayOpeningStatus',
						params.shouldUpdateTo,
					);
					break;
				case 'currentStatus':
					status = await adminFunctions().setShopStatus(
						'currentStatus',
						params.shouldUpdateTo,
					);
					break;
				default:
					return res.status(400).json({
						isSuccess: false,
						error: 'Please give a valid input to change status',
					});
					break;
			}
			if (status !== -1)
				return res.status(200).json({
					isSuccess: true,
					[shouldChange]: status,
				});
			return res.status(400).json({
				isSuccess: false,
				error:
					'An unexpected error occurred while fetching or updating the status',
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
    @ Route Address => '/get-shop-status/:statusOf'
    @ Route Access => Private
    @ Description => A route for getting required status 

*/
router.get(
	'/get-shop-status/:statusOf',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const status = await adminFunctions().getShopStatus(req.params.statusOf);
			if (status !== -1)
				return res.status(200).json({
					isSuccess: true,
					[req.params.statusOf]: status,
				});
			return res.status(500).json({
				isSuccess: false,
				error:
					'An unexpected error occurred. Please check you are providing correct parameters',
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
