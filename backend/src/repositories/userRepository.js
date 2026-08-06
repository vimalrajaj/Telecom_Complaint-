const { pool } = require('../config/db');

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const updateUser = async (id, fields) => {
  const updates = [];
  const values = [];
  
  if (fields.name !== undefined) { updates.push('name = ?'); values.push(fields.name); }
  if (fields.email !== undefined) { updates.push('email = ?'); values.push(fields.email); }
  if (fields.phone !== undefined) { updates.push('phone = ?'); values.push(fields.phone); }
  if (fields.password !== undefined) { updates.push('password = ?'); values.push(fields.password); }
  
  if (updates.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.execute(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const findEngineers = async () => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, phone, role, created_at FROM users WHERE role = 'ENGINEER'"
  );
  return rows;
};

module.exports = { findById, updateUser, findEngineers };
