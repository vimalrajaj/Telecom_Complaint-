const { pool } = require('../config/db');

const create = async (complaintId, userId, message) => {
  const [result] = await pool.execute(
    'INSERT INTO comments (complaint_id, user_id, message) VALUES (?, ?, ?)',
    [complaintId, userId, message]
  );
  return result.insertId;
};

const findByComplaintId = async (complaintId) => {
  const [rows] = await pool.execute(
    `SELECT c.*, u.name as user_name, u.role as user_role
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.complaint_id = ?
     ORDER BY c.created_at ASC`,
    [complaintId]
  );
  return rows;
};

module.exports = { create, findByComplaintId };
