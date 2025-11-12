import express from 'express';
import {getMe, postLogin} from '../controllers/auth-controller.js';
import {authenticateToken} from '../../middlewares/authentication.js';

const authRouter = express.Router();

authRouter.post('/login', postLogin);
authRouter.route('/me').get(authenticateToken, getMe);

export default authRouter;
