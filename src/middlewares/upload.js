import multer from 'multer';
import path from 'node:path';
import fs from 'fs';

const tmpDir = path.resolve('src', 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Uploading file to tmp directory:', file.originalname);
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      console.error('Invalid file type:', file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    } else {
      cb(null, true);
    }
  },
});

export { upload };
