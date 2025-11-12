import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

const getUser = (req, res) => {
  res.json(listAllUsers());
};

const getUserById = (req, res) => {
  const user = findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = (req, res) => {
  if (req.file) req.body.filename = req.file.filename;

  const result = addUser(req.body);
  if (result && result.user_id) {
    res.status(201);
    res.json({message: 'New user added.', result});
  } else {
    res.sendStatus(400);
  }
};

const putUser = (req, res) => {
  const replace = modifyUser(req.params.id, req.body);
  if (replace) {
    res.status(200);
    res.json({message: 'User item updated.'});
  } else {
    res.sendStatus(404);
  }
};

const deleteUser = (req, res) => {
  const remove = removeUser(req.params.id);
  if (remove) {
    res.status(204);
    res.json({message: 'User item deleted.'});
  } else {
    res.sendStatus(404);
  }
};

export {getUser, getUserById, postUser, putUser, deleteUser};
