import {findCatById} from '../api/models/cat-model.js';

const requireAuthenticated = (req, res, next) => {
  if (!res.locals || !res.locals.user) return res.sendStatus(401);
  next();
};

const authorizeCatOwnerOrAdmin = async (req, res, next) => {
  try {
    if (!res.locals || !res.locals.user) return res.sendStatus(401);
    const user = res.locals.user;
    const catId = Number(req.params.id);
    if (!catId) return res.status(400).json({error: 'Invalid cat id'});

    const cat = await findCatById(catId);
    if (!cat) return res.sendStatus(404);

    if (Number(cat.owner) === Number(user.user_id) || user.role === 'admin') {
      return next();
    }
    return res.sendStatus(403);
  } catch (err) {
    console.error('authorizeCatOwnerOrAdmin error', err);
    return res.sendStatus(500);
  }
};

const authorizeUserSelfOrAdmin = (req, res, next) => {
  if (!res.locals || !res.locals.user) return res.sendStatus(401);
  const user = res.locals.user;
  const targetId = Number(req.params.id);
  if (!targetId) return res.status(400).json({error: 'Invalid user id'});

  if (Number(user.user_id) === targetId || user.role === 'admin') return next();
  return res.sendStatus(403);
};

export {
  requireAuthenticated,
  authorizeCatOwnerOrAdmin,
  authorizeUserSelfOrAdmin,
};
