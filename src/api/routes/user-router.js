import express from 'express';
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';
import {authorizeUserSelfOrAdmin} from '../../middlewares/authorization.js';

const userRouter = express.Router();

userRouter.route('/').get(getUser).post(postUser);

userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, authorizeUserSelfOrAdmin, putUser)
  .delete(authenticateToken, authorizeUserSelfOrAdmin, deleteUser);

export default userRouter;
