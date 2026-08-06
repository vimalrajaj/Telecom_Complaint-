const { pool } = require('../config/db');

const create = async (title, description, priority, customerId) => {
  const [result] = await pool.execute(
    'INSERT INTO complaints (title, description, priority, customer_id) VALUES (?, ?, ?, ?)',
    [title, description, priority || 'MEDIUM', customerId]
  );
  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name as customer_name, u.email as customer_email 
     FROM complaints c 
     JOIN users u ON c.customer_id = u.id 
     WHERE c.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const findByCustomerId = async (customerId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name as customer_name 
     FROM complaints c 
     JOIN users u ON c.customer_id = u.id 
     WHERE c.customer_id = ? 
     ORDER BY c.created_at DESC`,
    [customerId]
  );
  return rows;
};

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name as customer_name, u.email as customer_email 
     FROM complaints c 
     JOIN users u ON c.customer_id = u.id 
     ORDER BY c.created_at DESC`
  );
  return rows;
};

const update = async (id, fields) => {
  const updates = [];
  const values = [];
  
  if (fields.title !== undefined) { updates.push('title = ?'); values.push(fields.title); }
  if (fields.description !== undefined) { updates.push('description = ?'); values.push(fields.description); }
  if (fields.priority !== undefined) { updates.push('priority = ?'); values.push(fields.priority); }
  if (fields.status !== undefined) { updates.push('status = ?'); values.push(fields.status); }
  
  if (updates.length === 0) return false;
  
  values.push(id);
  const [result] = await pool.execute(
    `UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  return result.affectedRows > 0;
};

const updateStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE complaints SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

// Transactional version for use with a connection
const updateStatusWithConnection = async (connection, id, status) => {
  const [result] = await connection.execute(
    'UPDATE complaints SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM complaints WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  create, findById, findByCustomerId, findAll,
  update, updateStatus, updateStatusWithConnection, remove
};
