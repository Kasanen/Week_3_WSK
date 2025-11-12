import express from 'express';
import multer from 'multer';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

import {createThumbnail} from '../../middlewares/upload.js';

const catRouter = express.Router();

const upload = multer({dest: 'src/uploads/'});

catRouter
  .route('/')
  .get(getCat)
  .post(upload.single('file'), createThumbnail, postCat);

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
