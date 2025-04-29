// fileUpload.js
import multer from 'multer';
import path from 'path';

// File filter to allow only images and PDFs
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
};

// Use memory storage so we can upload directly to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // optional: limit size to 5MB
});

export const uploadDeliveryPersonFiles = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'vehicleLicense', maxCount: 1 }
]);
