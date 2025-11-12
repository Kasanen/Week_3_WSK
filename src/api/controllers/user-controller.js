import {
  addUser,
  findUserById,
  listAllUsers,
  modifyUser,
  removeUser,
} from '../models/user-model.js';
import bcrypt from 'bcrypt';

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

const postUser = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const result = await addUser(req.body);
    if (result.user_id) {
      res.status(201);
      res.json({message: 'New user added.', result});
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.sendStatus(500);
  }
};

const putUser = async (req, res) => {
  const actorId = res.locals?.user?.user_id;
  const actorRole = res.locals?.user?.role;
  if (!actorId) return res.sendStatus(401);

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updated = await modifyUser(
      req.body,
      Number(req.params.id),
      actorId,
      actorRole
    );
    if (updated) {
      return res.json(updated);
    }
    return res.sendStatus(403);
  } catch (err) {
    console.error('putUser error', err);
    return res.status(500).json({error: err.message});
  }
};

const deleteUser = async (req, res) => {
  const actorId = res.locals?.user?.user_id;
  const actorRole = res.locals?.user?.role;
  if (!actorId) return res.sendStatus(401);

  try {
    const ok = await removeUser(Number(req.params.id), actorId, actorRole);
    if (ok) {
      return res.sendStatus(204);
    }
    return res.sendStatus(403);
  } catch (err) {
    console.error('deleteUser error', err);
    return res.status(500).json({error: err.message});
  }
};
export {getUser, getUserById, postUser, putUser, deleteUser};
