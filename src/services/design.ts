import cloudinary from 'cloudinary';
import { Design } from './../models/design';
export const designFunctions = () => {
	try {
		cloudinary.v2.config({
			cloud_name: 'rahuls249',
			api_key: '141244768993986',
			api_secret: 'uv4Ve9aWMIEtRiONmdAtUiCyL6g',
		});
	} catch (error) {
		console.log(
			'An unexpected error occurred while configuration of cloudinary',
			error,
		);
	}
	const uploadDesignImage = async (path: string, name: string) => {
		const uploadedImageData = await cloudinary.v2.uploader.upload(path, {
			public_id: name,
		});

		if (uploadedImageData) return uploadedImageData.secure_url;
		return false;
	};

	const saveDesignData = async (designData: any) => {
		return new Design(designData).save();
	};

	const getDesignData = async (designId: string) => {
		return Design.findById(designId);
	};
	const updateDesign = async (
		designId: string,
		shouldUpdate: string,
		value: string,
	) => {
		await Design.findByIdAndUpdate(designId, {
			[shouldUpdate]: value,
		});
		return designFunctions().get(designId);
	};
	const deleteDesign = async (designId: string) => {
		return Design.findByIdAndDelete(designId);
	};

	const isOwnerOfDesign = async (designId: string, ownerId: string) => {
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
