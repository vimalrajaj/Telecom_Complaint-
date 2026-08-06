const { pool } = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
};

const createUser = async (name, email, hashedPassword, phone, role = 'CUSTOMER') => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, phone || null, role]
  );
  return result.insertId;
};

module.exports = { findByEmail, createUser };
