import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

// ১. ক্লাউডিনারি কনফিগারেশন
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ২. ক্লাউডিনারিতে ইমেজ পাঠানোর ফাংশন
export const sendImageToCloudinary = (imageName: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      (error, result) => {
        // আপলোড হয়ে গেলে লোকাল সার্ভার (uploads folder) থেকে ফাইল ডিলিট করে দেওয়া ভালো
        fs.unlinkSync(path); 
        
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });
};

// ৩. লোকাল স্টোরেজ কনফিগারেশন (ফাইলটি আপলোড হওয়ার সময় সাময়িকভাবে এখানে থাকবে)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = process.cwd() + '/uploads';
    // যদি 'uploads' ফোল্ডার না থাকে তবে তৈরি করবে
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });