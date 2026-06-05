const pool = require('../config/db');

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE student_id = $1 
       ORDER BY due_date ASC`,
      [req.user.studentId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE id = $1 AND student_id = $2`,
      [req.params.id, req.user.studentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE TASK
const createTask = async (req, res) => {
  console.log('Create task hit');
  console.log('Body:', req.body);
  console.log('User:', req.user);
  const { title, description, due_date, priority, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (student_id, title, description, due_date, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.studentId, title, description, due_date, priority || 'medium', status || 'pending']
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  const { title, description, due_date, priority, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, 
           priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND student_id = $7
       RETURNING *`,
      [title, description, due_date, priority, status, req.params.id, req.user.studentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM tasks 
       WHERE id = $1 AND student_id = $2
       RETURNING *`,
      [req.params.id, req.user.studentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET TASKS BY STATUS
const getTasksByStatus = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE student_id = $1 AND status = $2
       ORDER BY due_date ASC`,
      [req.user.studentId, req.params.status]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTasksByStatus };