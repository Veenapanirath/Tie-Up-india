import fs from 'fs';
//automatically  --> file system
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    //file  has ben  upload  sucessfully
    console.log('file uploaded', response.url);
    fs.unlinkSync(localFilePath);
    //print  public  url
    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the   locally  saved  temp  file --> upload operation got  fail
    return null;
  }
};


// Delete Image from Cloudinary by URL
const deleteFromCloudinaryByUrl = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const segments = imageUrl.split("/");
    const fileName = segments.pop(); // xyz123.jpg
    const publicId = fileName.split(".")[0];
    const folder = segments.pop(); // folder name
    const cloudinaryPublicId = `${folder}/${publicId}`;

    await cloudinary.uploader.destroy(cloudinaryPublicId);
    console.log("Old image deleted from Cloudinary:", cloudinaryPublicId);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);
  }
};

// Upload a PDF document
const uploadPDFOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'raw',
      folder: 'documents',
      allowed_formats: ['pdf'],
      access_mode: "public",
    });
    //file  has ben  upload  sucessfully
    console.log('PDF uploaded', response.secure_url , "url" , response.url);
    fs.unlinkSync(localFilePath);
    //print  public  url
    return response;

  } catch (error) {
    console.error('PDF upload error:', error);
    fs.unlinkSync(localFilePath); //remove the   locally  saved  temp  file --> upload operation got  fail
    return null;
  }
};

export { uploadOnCloudinary , uploadPDFOnCloudinary, deleteFromCloudinaryByUrl };
