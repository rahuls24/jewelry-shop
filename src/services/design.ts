import cloudinary from 'cloudinary';
import { Design } from './../models/design';
export const designFunctions = () => {
	try {
		cloudinary.v2.config({
			cloud_name: 'rahuls249',
			api_key: '141244768993986',
			api_secret: 'uv4Ve9aWMIEtRiONmdAtUiCyL6g',
		});
	} catch (error) {}
	const uploadDesignImage = async (path: any, name: any) => {
		const uploadedImageData = await cloudinary.v2.uploader.upload(path, {
			public_id: name,
		});

		if (uploadedImageData) return uploadedImageData.secure_url;
		return false;
	};

	const saveDesignData = async (designData: any) => {
		return await new Design(designData).save();
	};

	const getDesignData = async (designId: any) => {
		return await Design.findById(designId);
	};
	const updateDesign = async (designId: any, shouldUpdate: any, value: any) => {
		await Design.findByIdAndUpdate(designId, {
			[shouldUpdate]: value,
		});
		return await designFunctions().get(designId);
	};
	const deleteDesign = async (designId: any) => {
		return Design.findByIdAndDelete(designId);
	};

	const isOwnerOfDesign = async (designId: any, ownerId: any) => {
		const design = await designFunctions().get(designId);
		if (design?.owner === ownerId) return true;
		return false;
	};

	return {
		upload: uploadDesignImage,
		save: saveDesignData,
		get: getDesignData,
		update: updateDesign,
		delete: deleteDesign,
		isOwner: isOwnerOfDesign,
	};
};
