import {
  addCat,
  findCatById,
  listAllCats,
  modifyCat,
  removeCat,
  listCatsByUser,
} from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatsByUser = async (req, res) => {
  try {
    const cats = await listCatsByUser(req.params.id);
    return res.json(cats);
  } catch (err) {
    console.error('getCatsByUser error', err);
    return res.status(500).json({error: err.message});
  }
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  if (req.file) req.body.filename = req.file.filename;

  const result = addCat(req.body);
  if (result && result.cat_id) {
    res.status(201);
    res.json({message: 'New cat added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  const replace = modifyCat(req.params.id, req.body);
  if (replace) {
    res.status(200);
    res.json({message: 'Cat item updated.'});
  } else {
    res.sendStatus(404);
  }
};

const deleteCat = (req, res) => {
  const remove = removeCat(req.params.id);
  if (remove) {
    res.status(204);
    res.json({message: 'Cat item deleted.'});
  } else {
    res.sendStatus(404);
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat, getCatsByUser};
