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
import {authenticateToken} from '../../middlewares/authentication.js';
import {authorizeCatOwnerOrAdmin} from '../../middlewares/authorization.js';

const catRouter = express.Router();

const upload = multer({dest: 'src/uploads/'});

/*
GET → get data

POST → create data

PUT → replace data

PATCH → update data partially

DELETE → remove data
*/

catRouter
  .route('/')
  .get(getCat)
  .post(upload.single('file'), createThumbnail, postCat);

// route to connect user
catRouter.route('/user/:id').get(getCatsByUser);

catRouter
  .route('/:id')
  .get(getCatById)
  .put(authenticateToken, authorizeCatOwnerOrAdmin, putCat)
  .delete(authenticateToken, authorizeCatOwnerOrAdmin, deleteCat);

export default catRouter;
