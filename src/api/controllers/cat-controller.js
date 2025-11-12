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

const putCat = async (req, res) => {
  const actorId = res.locals?.user?.user_id;
  const actorRole = res.locals?.user?.role;
  if (!actorId) return res.sendStatus(401);

  if (req.file) req.body.filename = req.file.filename;

  const replace = await modifyCat(
    req.body,
    Number(req.params.id),
    actorId,
    actorRole
  );
  if (replace) {
    return res.status(200).json(replace);
  } else {
    return res.sendStatus(403);
  }
};

const deleteCat = async (req, res) => {
  const actorId = res.locals?.user?.user_id;
  const actorRole = res.locals?.user?.role;
  if (!actorId) return res.sendStatus(401);

  const removed = await removeCat(Number(req.params.id), actorId, actorRole);
  if (removed) {
    return res.sendStatus(204);
  } else {
    return res.sendStatus(403);
  }
};

export {getCat, getCatById, postCat, putCat, deleteCat, getCatsByUser};
