const controllerRoute = '/api/admin';
import express, { Request, Response } from 'express';
import { adminFunctions } from './../services/admin';
import {
	typeChecker,
	errorHandler,
	httpStatus,
} from './../services/commonFunctions';
const httpStatusCode = httpStatus();
import passport from 'passport';
export const router = express.Router();

/*
    @ Route Type => POST
    @ Route Address => '/set-price'
    @ Route Access => Private
    @ Description => A route for setting the price
	@params => User can give anything which is present in jewelryTypeList
*/
router.post(
	'/set-price',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const previousPriceData: any = await adminFunctions().getPrices();
			const currentPriceData: any = {};

			// Getting list of element list from .env file
			const jewelryTypeList: any = process.env.priceAvailable?.split('+');
			// We are getting all params as string so converting those in Integer

			for (const key in req.body) {
				currentPriceData[key] = Number(req.body[key]);
			}
			if (!typeChecker().isAllFieldComingFromBody(currentPriceData))
				return res.status(httpStatusCode.badRequest).json({
					isSuccess: false,
					error: 'Please give value for which you want to change the price',
				});

			// All params are optional to send from body so we are initializes which is not send by user
			for (const jewelry of jewelryTypeList) {
				if (!(jewelry in currentPriceData))
					currentPriceData[jewelry] = previousPriceData[jewelry];
			}
			// Checking that either user have sent some value which is not present in  jewelryTypeList
			for (const key in currentPriceData) {
				if (!(key in previousPriceData))
					return res.status(httpStatusCode.badRequest).json({
						isSuccess: false,
						error: 'Please give correct attribute ',
					});
			}
			const newPrice = await adminFunctions().setPrices(currentPriceData);
			if (newPrice)
				return res.status(httpStatusCode.accepted).json({
					isSuccess: true,
					prices: newPrice,
				});
			return res.status(httpStatusCode.notFound).json({
				isSuccess: false,
				error:
					'There is some unexpected error occurred while updating of getting the price from db',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);
/*
    @ Route Type => GET
    @ Route Address => '/get-price'
    @ Route Access => Private
    @ Description => A route for get the price  list
	@params => Noting is needed
*/
router.get(
	'/get-price',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const prices = await adminFunctions().getPrices();
			if (prices)
				return res.status(httpStatusCode.accepted).json({
					isSuccess: true,
					prices,
				});
			return res.json(httpStatusCode.notFound).json({
				isSuccess: false,
				error: 'No price list present in DB',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);

/*
    @ Route Type => POST
    @ Route Address => '/set-shop-status/:shouldUpdate/:shouldUpdateTo'
    @ Route Access => Private
    @ Description => A route for setting shop status
	@params => Asked in url
*/

router.get(
	'/set-shop-status/:shouldUpdate/:shouldUpdateTo',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		const params = {
			shouldUpdate: req.params.shouldUpdate,
			shouldUpdateTo: req.params.shouldUpdateTo,
		};
		if (!typeChecker().isBoolean(params.shouldUpdateTo))
			return res.status(httpStatusCode.badRequest).json({
				isSuccess: false,
				error: 'Please give boolean value to change the status',
			});
		try {
			let status;
			switch (req.params.shouldUpdate) {
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
					return res.status(httpStatusCode.badRequest).json({
						isSuccess: false,
						error: 'Please give a valid input to change status',
					});
			}
			if (status !== -1)
				return res.status(httpStatusCode.accepted).json({
					isSuccess: true,
					[req.params.shouldUpdate]: status,
				});
			return res.status(httpStatusCode.notFound).json({
				isSuccess: false,
				error:
					'An unexpected error occurred while fetching or updating the status',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);
/*
    @ Route Type => GET
    @ Route Address => '/get-shop-status/:statusOf'
    @ Route Access => Private
    @ Description => A route for getting required status 
	@params => Asked in url
*/
router.get(
	'/get-shop-status/:statusOf',
	passport.authenticate('admin', { session: false }),
	async (req: Request, res: Response) => {
		try {
			const status = await adminFunctions().getShopStatus(req.params.statusOf);
			if (status !== -1)
				return res.status(httpStatusCode.accepted).json({
					isSuccess: true,
					[req.params.statusOf]: status,
				});
			return res.status(httpStatusCode.notFound).json({
				isSuccess: false,
				error: 'No status found for entered params',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);
