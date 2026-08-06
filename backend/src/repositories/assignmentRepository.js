const { pool } = require('../config/db');

const createWithConnection = async (connection, complaintId, engineerId, assignedBy) => {
  const [result] = await connection.execute(
    'INSERT INTO assignments (complaint_id, engineer_id, assigned_by) VALUES (?, ?, ?)',
    [complaintId, engineerId, assignedBy]
  );
  return result.insertId;
};

const findByComplaintId = async (complaintId) => {
  const [rows] = await pool.execute(
    `SELECT a.*, u.name as engineer_name, u.email as engineer_email,
            admin.name as assigned_by_name
     FROM assignments a
     JOIN users u ON a.engineer_id = u.id
     JOIN users admin ON a.assigned_by = admin.id
     WHERE a.complaint_id = ?`,
    [complaintId]
  );
  return rows[0] || null;
};

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT a.*, 
            u.name as engineer_name, u.email as engineer_email,
            admin.name as assigned_by_name,
            c.title as complaint_title, c.status as complaint_status
     FROM assignments a
     JOIN users u ON a.engineer_id = u.id
     JOIN users admin ON a.assigned_by = admin.id
     JOIN complaints c ON a.complaint_id = c.id
     ORDER BY a.created_at DESC`
  );
  return rows;
};

const findByEngineerId = async (engineerId) => {
  const [rows] = await pool.execute(
    `SELECT a.*, 
            c.title as complaint_title, c.description as complaint_description,
            c.priority as complaint_priority, c.status as complaint_status,
            cust.name as customer_name, cust.email as customer_email
     FROM assignments a
     JOIN complaints c ON a.complaint_id = c.id
     JOIN users cust ON c.customer_id = cust.id
     WHERE a.engineer_id = ?
     ORDER BY a.created_at DESC`,
    [engineerId]
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT a.*, c.title as complaint_title, c.status as complaint_status
     FROM assignments a
     JOIN complaints c ON a.complaint_id = c.id
     WHERE a.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const updateStatus = async (id, status) => {
  const [result] = await pool.execute(
    'UPDATE assignments SET status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  createWithConnection, findByComplaintId, findAll,
  findByEngineerId, findById, updateStatus
};
