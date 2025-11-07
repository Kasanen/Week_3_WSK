// mock data
const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2021-10-12',
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (id) => {
  return catItems.find((item) => item.cat_id == id);
};

const addCat = (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const newId = catItems[0].cat_id + 1;
  catItems.unshift({
    cat_id: newId,
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  });
  return {cat_id: newId};
};

const updateCat = (id, cat) => {
  const realId = parseInt(id, 10);
  const idx = catItems.findIndex((item) => item.cat_id === realId);
  if (idx === -1) return null;
  const existing = catItems[idx];
  const updated = {...existing, ...cat, cat_id: existing.cat_id};
  catItems[idx] = updated;
  return updated;
};

const removeCat = (id) => {
  const realId = parseInt(id, 10);
  const idx = catItems.findIndex((item) => item.cat_id === realId);
  if (idx === -1) return null;
  const [removed] = catItems.splice(idx, 1);
  return removed;
};
export {listAllCats, findCatById, addCat, updateCat, removeCat};
