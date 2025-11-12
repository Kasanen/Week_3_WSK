import express from 'express';
import multer from 'multer';

import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
  getCatsByUser,
} from '../controllers/cat-controller.js';

import {createThumbnail} from '../../middlewares/upload.js';

const catRouter = express.Router();

const upload = multer({dest: 'src/uploads/'});

catRouter
  .route('/')
  .get(getCat)
  .post(upload.single('file'), createThumbnail, postCat);

// route to connect user
catRouter.route('/user/:id').get(getCatsByUser);

catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
