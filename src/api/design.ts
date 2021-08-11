const controllerRoute = '/api/design';
import express, { Request, Response } from 'express';
export const router = express.Router();
import multer from 'multer';
import {
	typeChecker,
	fileHandler,
	errorHandler,
} from './../services/commonFunctions';
const upload = multer({ dest: './src/tempImageFromMulter' }).single(
	'design-image',
);
import passport from 'passport';
import { designFunctions } from './../services/design';
import { isValidObjectId } from 'mongoose';
// TODO: Testing is pending
// TODO: Get all the design or get customer specific design (only for admin)
// TODO: Check the user uploaded only image

/*
    @ Route Type => Post
    @ Route Address => '/upload-design'
    @ Route Access => Private
    @ Description => A route for uploading the design 
*/
router.post(
	'/upload-design',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		upload(req, res, async err => {
			if (err instanceof multer.MulterError) {
				return errorHandler().catchBlockHandler(req, res, err, controllerRoute);
				console.log(24);
			} else if (err) {
				// An unknown error occurred when uploading.
				return errorHandler().catchBlockHandler(req, res, err, controllerRoute);
			}
			// Everything went fine.
			const user: any = req.user;
			const designData = {
				owner: user.id,
				imageAddress: req.file?.path,
				designName: 'unnamed',
			};
			if (!typeChecker().isAllFieldComingFromBody(designData))
				return res.status(400).json({
					isSuccess: false,
					errorMessage: 'Please provide all required parameter',
				});
			if (req.body.designName) designData.designName = req.body.designName;
			try {
				const imgUrl = await designFunctions().upload(
					designData.imageAddress ?? 'false',
					designData.designName,
				);
				console.log(imgUrl, 'Image URL');
				if (designData.imageAddress) {
					const isUploadedFileDelate = fileHandler().delateFile(
						designData.imageAddress,
					);
					if (!isUploadedFileDelate)
						console.log('Uploaded file is not deleted  from local storage');
				}
				if (imgUrl) {
					designData.imageAddress = imgUrl;
					const newDesign = await designFunctions().save(designData);
					if (newDesign)
						return res.status(201).json({
							isSuccess: true,
							design: newDesign,
						});
					return res.json(404).json({
						isSuccess: false,
						error: 'There is an unexpected error occurred',
					});
				}
				return res.status(500).json({
					isSuccess: false,
					error:
						'There is an unexpected error occurred while uploading the image on server',
				});
			} catch (error) {
				return errorHandler().catchBlockHandler(
					req,
					res,
					error,
					controllerRoute,
				);
			}
		});
	},
);

/*
    @ Route Type => GET
    @ Route Address => '/update-design/:shouldUpdate'
    @ Route Access => Private
    @ Description => A route for updating the design except design image
*/
router.get(
	'/get-design/:designId',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		if (!isValidObjectId(req.params.designId))
			return res.status(400).json({
				isSuccess: false,
				error: 'Please provide a valid design id',
			});
		const user: any = req.user;
		try {
			if (!(await designFunctions().isOwner(req.params.designId, user.id)))
				return res.status(401).json({
					isSuccess: false,
					error: 'User is not owner of requested design',
				});
			const design = await designFunctions().get(req.params.designId);
			if (design)
				return res.status(200).json({
					isSuccess: true,
					design,
				});
			return res.status(404).json({
				isSuccess: false,
				error: 'No design found',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);

/*
    @ Route Type => GET
    @ Route Address => '/update-design/:shouldUpdate'
    @ Route Access => Private
    @ Description => A route for updating the design except design image
*/
router.get(
	'/update-design/:designId/:shouldUpdate/:value',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		if (!isValidObjectId(req.params.designId))
			return res.status(400).json({
				isSuccess: false,
				error: 'Please provide a valid design ID id',
			});
		const user: any = req.user;
		if (!(await designFunctions().isOwner(req.params.designId, user.id)))
			return res.status(401).json({
				isSuccess: false,
				error: 'User is not owner of requested design',
			});
		try {
			const updatedDesign = await designFunctions().update(
				req.params.designId,
				req.params.shouldUpdate,
				req.params.value,
			);
			if (updatedDesign)
				return res.status(200).json({
					isSuccess: true,
					design: updatedDesign,
				});
			return res.status(500).json({
				isSuccess: true,
				error: 'No design found with given design id',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);

/*
    @ Route Type => POST
    @ Route Address => '/update-image'
    @ Route Access => Private
    @ Description => A route for updating only design image
*/
router.post(
	'/update-image',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		upload(req, res, async err => {
			if (err instanceof multer.MulterError) {
				// A Multer error occurred when uploading.
				return errorHandler().catchBlockHandler(req, res, err, controllerRoute);
			} else if (err) {
				return errorHandler().catchBlockHandler(req, res, err, controllerRoute);
			}
			// Everything went fine.
			const designData = {
				designId: req.body.designId,
				designAddress: req.file?.path,
				designName: 'unnamed',
			};
			if (!typeChecker().isAllFieldComingFromBody(designData))
				return res.status(400).json({
					isSuccess: false,
					error: 'Please provide all required field',
				});
			const user: any = req.user;
			if (!(await designFunctions().isOwner(designData.designId, user.id)))
				return res.status(401).json({
					isSuccess: false,
					error: 'User is not owner of requested design',
				});
			if (req.body.designName) designData.designName = req.body.designName;
			try {
				const imgUrl: any = await designFunctions().upload(
					designData.designAddress ?? 'false',
					'update',
				);
				const isDeleted = fileHandler().delateFile(
					designData.designAddress ?? 'false',
				);
				if (!isDeleted)
					console.log('Uploaded file is not deleted  from local storage');
				if (imgUrl) designData.designAddress = imgUrl;
				else
					return res.status(500).json({
						isSuccess: false,
						error:
							'An unexpected error occurred while uploading the design image',
					});
				const updatedDesign = await designFunctions().update(
					designData.designId,
					'imageAddress',
					designData.designAddress ?? 'false',
				);
				if (updatedDesign)
					return res.status(200).json({
						isSuccess: true,
						design: updatedDesign,
					});
				return res.status(404).json({
					isSuccess: true,
					error: 'No design found with given id',
				});
			} catch (error) {
				return errorHandler().catchBlockHandler(
					req,
					res,
					error,
					controllerRoute,
				);
			}
		});
	},
);

/*
    @ Route Type => POST
    @ Route Address => '/update-image'
    @ Route Access => Private
    @ Description => A route for updating only design image
*/
router.delete(
	'/delete-design/:designId',
	passport.authenticate(['admin', 'customer'], { session: false }),
	async (req: Request, res: Response) => {
		if (!isValidObjectId(req.params.designId))
			return res.status(400).json({
				isSuccess: false,
				error: 'Please give a valid id',
			});
		const user: any = req.user;
		if (!(await designFunctions().isOwner(req.params.designId, user.id)))
			return res.status(401).json({
				isSuccess: false,
				error: 'User is not owner of requested design',
			});
		try {
			if (await designFunctions().delete(req.params.designId))
				return res.status(200).json({
					isSuccess: true,
				});
			return res.status(404).json({
				isSuccess: false,
				error: 'No design found with given id',
			});
		} catch (error) {
			return errorHandler().catchBlockHandler(req, res, error, controllerRoute);
		}
	},
);
