import cloudinary from 'cloudinary';

cloudinary.v2.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath) => {
  try {
    console.log('Uploading file to Cloudinary:', filePath);
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'contacts_photos',
    });
    console.log('Cloudinary upload successful:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error;
  }
};
