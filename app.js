import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/api/v1/cat', (req, res) => {
  const cats = [
    {
      cat_id: 1,
      name: 'Miuku',
      birthdate: '5.2.2014',
      weight: 5,
      owner: 'owner1',
      image: 'https://loremflickr.com/320/240/cat',
    },
    {
      cat_id: 2,
      name: 'Mauku',
      birthdate: '21.7.2022',
      weight: 7,
      owner: 'owner2',
      image: 'https://loremflickr.com/320/240/cat',
    },
    {
      cat_id: 3,
      name: 'Murr',
      birthdate: '6.7.2020',
      weight: 9,
      owner: 'owner3',
      image: 'https://loremflickr.com/320/240/cat',
    },
  ];
  res.json(cats);
});
