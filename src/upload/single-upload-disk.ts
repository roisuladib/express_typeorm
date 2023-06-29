import { Request } from 'express';
import multer from 'multer';
import { uuid } from '../utils';
import { TypedRequestBody } from '../types';

const multerStorage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, `${__dirname}/../../public/posts/single`);
   },
   filename: (
      req: TypedRequestBody<{ image: string; images: string[] }>,
      file,
      callback
   ) => {
      const ext = file.mimetype.split('/')[1];
      const filename = `post-${uuid()}-${Date.now()}.${ext}`;
      req.body.image = filename;
      req.body.images = [];
      callback(null, filename);
   },
});

const multerFilter = (
   req: Request,
   file: Express.Multer.File,
   callback: multer.FileFilterCallback
) => {
   if (!file.mimetype.startsWith('image')) {
      return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE'));
   }
   callback(null, true);
};

const upload = multer({
   storage: multerStorage,
   fileFilter: multerFilter,
   limits: { fieldSize: 5 * 1024 * 1024, files: 1 },
});

export const uploadPostImageDisk = upload.single('image');
