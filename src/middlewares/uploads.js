import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const UPLOAD_DIR = 'public/uploads';
fs.mkdirSync(UPLOAD_DIR, {recursive: true});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({storage});

const createThumbnail = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const infile = path.join(UPLOAD_DIR, req.file.filename);
    const parsed = path.parse(req.file.filename);
    const thumbName = `${parsed.name}_thumb${parsed.ext}`;
    const thumbPath = path.join(UPLOAD_DIR, thumbName);

    await sharp(infile).resize({width: 200}).toFile(thumbPath);

    req.file.thumb = `/public/uploads/${thumbName}`;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const uploadFile = (fieldName = 'file') => [
  upload.single(fieldName),
  createThumbnail,
];

export default uploadFile;
