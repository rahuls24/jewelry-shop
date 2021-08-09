const controllerRoute = '/api/admin';
import express, { Request, Response, Application } from 'express';
import chalk from 'chalk';
import { adminFunctions } from './../services/admin';
import { isAllFieldComingFromBody } from './../services/commonFunctions';
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
