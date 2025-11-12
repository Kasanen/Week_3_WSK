import promisePool from '../../utils/database.js';

const findUserByUsername = async (user) => {
  const sql = `SELECT * FROM wsk_users WHERE username = ?`;
  const [rows] = await promisePool.query(sql, [user]);
  return rows[0];
};

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  console.log('rows', rows);
  return rows;
};

const findUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.length === 0) {
    return false;
  }
  return rows[0];
};

const addUser = async (user) => {
  const {name, username, email, password, role} = user;
  const sql = `INSERT INTO wsk_users (name, username, email, password, role)
               VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, password, role];
  const rows = await promisePool.execute(sql, params);
  console.log('rows', rows);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return {user_id: rows[0].insertId};
};

const modifyUser = async (user, id, loggedId, role) => {
  if (role === 'admin') {
    const sql = `UPDATE wsk_users SET ? WHERE user_id = ?`;
    const [result] = await promisePool.execute(sql, [user, id]);
    if (result.affectedRows === 0) return false;
    const [rows] = await promisePool.execute(
      'SELECT user_id, username, email, role FROM wsk_users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  }

  const sql = `UPDATE wsk_users SET ? WHERE user_id = ? AND user_id = ?`;
  const [result] = await promisePool.execute(sql, [user, id, loggedId]);
  if (result.affectedRows === 0) return false;
  const [rows] = await promisePool.execute(
    'SELECT user_id, username, email, role FROM wsk_users WHERE user_id = ?',
    [id]
  );
  return rows[0];
};

/*
const removeUser = async (id) => {
  const [rows] = await promisePool.execute(
    'DELETE FROM wsk_users WHERE user_id = ?',
    [id]
  );
  console.log('rows', rows);
  if (rows.affectedRows === 0) {
    return false;
  }
  return {message: 'success'};
};
*/

/**
 * Deletes a user and all associated data from the database.
 * @param {number} userId
 * @returns {Promise<{message: string}>}
 */
const removeUser = async (userId, actorId, role) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // delete dependent cats first
    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?;', [userId]);

    if (role === 'admin') {
      // admin can delete any user
      const [result] = await connection.execute(
        'DELETE FROM wsk_users WHERE user_id = ?;',
        [userId]
      );
      if (result.affectedRows === 0) {
        await connection.rollback();
        return false;
      }
      await connection.commit();
      return true;
    }

    // normal user: can delete only themselves
    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ? AND user_id = ?',
      [userId, actorId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('removeUser error', error.message);
    return false;
  } finally {
    connection.release();
  }
};

export {
  findUserByUsername,
  listAllUsers,
  findUserById,
  addUser,
  modifyUser,
  removeUser,
};
