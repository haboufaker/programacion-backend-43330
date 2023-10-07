import multer from 'multer';

// Define storage destinations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      cb(null, 'frontend/public/uploads/profiles/');
    } else if (file.fieldname === 'productImage') {
      cb(null, 'frontend/public/uploads/products/');
    } else if (file.fieldname === 'document') {
      cb(null, 'frontend/public/uploads/documents/');
    } else {
      cb(new Error('Invalid file fieldname'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Create a Multer instance
const upload = multer({ storage });

export { upload };
