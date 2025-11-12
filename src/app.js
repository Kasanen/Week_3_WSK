import express from 'express';
import catRouter from './api/routes/cat-router.js';
import userRouter from './api/routes/user-router.js';
import authRouter from './api/routes/auth-router.js';

// Create an app instance
const app = express();

// Middleware
app.use(express.json()); // parses JSON bodies
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public')); // serve static files

app.use('/api/v1/cats', catRouter);
app.use('/api/v1/users', userRouter);
//app.use('/api/v1auth/login', authRouter);
app.use('/api/v1/auth', authRouter);

// Define routes
app.get('/', (req, res) => {
  // app.get > defines a route that responds to GET requests
  res.send('Welcome to my REST API!'); // res > response object
}); // req (not used) > request object

export default app;
