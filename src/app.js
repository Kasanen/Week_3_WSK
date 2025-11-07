import express from 'express';
import catRouter from './api/routes/cat-router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static('public'));

app.use('/api/v1/cats', catRouter);

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

export default app;
