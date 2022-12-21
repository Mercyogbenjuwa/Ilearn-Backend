import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder:'ILEARN'
        }
    },
        
    
});

export const upload = multer({ storage: storage });