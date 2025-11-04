// mock data
const userItems = [
  {
    user_id: 3609,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@metropolia.fi',
    role: 'user',
    password: 'password',
  },
];

const listAllUsers = () => {
  return userItems;
};

const findUserById = (id) => {
  return userItems.find((item) => item.user_id == id);
};

const addUser = (user) => {
  const {name, username, email, role, password} = user;
  const newId = userItems[0].user_id + 1;
  userItems.unshift({
    user_id: newId,
    name,
    username,
    email,
    role,
    password,
  });
  return {user_id: newId};
};

const updateUser = (id, user) => {
  const realId = parseInt(id, 10);
  const idx = userItems.findIndex((item) => item.user_id === realId);
  if (idx === -1) return null;
  const existing = userItems[idx];
  const updated = {...existing, ...user, user_id: existing.user_id};
  userItems[idx] = updated;
  return updated;
};

const removeUser = (id) => {
  const realId = parseInt(id, 10);
  const idx = userItems.findIndex((item) => item.user_id === realId);
  if (idx === -1) return null;
  const [removed] = userItems.splice(idx, 1);
  return removed;
};
export {listAllUsers, findUserById, addUser, updateUser, removeUser};
