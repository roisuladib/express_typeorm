import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { uuid } from '../utils';

const multerStorage = multer.memoryStorage();

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
   limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export const uploadPostImage = upload.single('image');

export const resizePostImage = async (
   req: Request<{}, {}, { image: string }>,
   res: Response,
   next: NextFunction
) => {
   try {
      const file = req.file;
      if (!file) return next();

      const fileName = `post-${uuid()}-${Date.now()}.jpeg`;
      await sharp(req.file?.buffer)
         .resize(800, 450)
         .toFormat('jpeg')
         .jpeg({ quality: 90 })
         .toFile(`${__dirname}/../../public/posts/single/${fileName}`);

      req.body.image = fileName;

      next();
   } catch (err: any) {
      next(err);
   }
};
