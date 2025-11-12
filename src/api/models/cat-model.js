import promisePool from '../../utils/database.js';

/*
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
*/

const listCatsByUser = async (userId) => {
  const sql = `
    SELECT c.*, u.username AS owner_name
    FROM wsk_cats c
    LEFT JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.owner = ?
  `;
  const [rows] = await promisePool.execute(sql, [userId]);
  return rows;
};

const listAllCats = async () => {
  const sql = `
    SELECT c.*, u.username AS owner_name
    FROM wsk_cats c
    LEFT JOIN wsk_users u ON c.owner = u.user_id
  `;
  const [rows] = await promisePool.query(sql);
  console.log('rows', rows);
  return rows;
};

const findCatById = async (id) => {
  const sql = `
    SELECT c.*, u.username AS owner_name
    FROM wsk_cats c
    LEFT JOIN wsk_users u ON c.owner = u.user_id
    WHERE c.cat_id = ?
  `;
  const [rows] = await promisePool.execute(sql, [id]);
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addCat = async (cat) => {
  const {cat_name, weight, owner, filename, birthdate} = cat;
  const sql = `INSERT INTO wsk_cats (cat_name, weight, owner, filename, birthdate)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [cat_name, weight, owner, filename, birthdate];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {cat_id: rows[0].insertId};
};

const modifyCat = async (cat, id, loggedId, role) => {
  if (role === 'admin') {
    const sql = `UPDATE wsk_cats SET ? WHERE cat_id = ?`;
    const [result] = await promisePool.execute(sql, [cat, id]);
    if (result.affectedRows === 0) return false;

    const [rows] = await promisePool.execute(
      `SELECT c.*, u.username AS owner_name
       FROM wsk_cats c
       LEFT JOIN wsk_users u ON c.owner = u.user_id
       WHERE c.cat_id = ?`,
      [id]
    );
    return rows[0];
  }

  const sql = `UPDATE wsk_cats SET ? WHERE cat_id = ? AND owner = ?`;
  const [result] = await promisePool.execute(sql, [cat, id, loggedId]);
  if (result.affectedRows === 0) return false;

  const [rows] = await promisePool.execute(
    `SELECT c.*, u.username AS owner_name
     FROM wsk_cats c
     LEFT JOIN wsk_users u ON c.owner = u.user_id
     WHERE c.cat_id = ?`,
    [id]
  );
  return rows[0];
};

const removeCat = async (id, loggedId, role) => {
  if (role === 'admin') {
    const [result] = await promisePool.execute(
      'DELETE FROM wsk_cats WHERE cat_id = ?',
      [id]
    );
    if (result.affectedRows === 0) return false;
    return true;
  }

  const [result] = await promisePool.execute(
    'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?',
    [id, loggedId]
  );
  if (result.affectedRows === 0) return false;
  return true;
};

export {listAllCats, findCatById, addCat, modifyCat, removeCat, listCatsByUser};
