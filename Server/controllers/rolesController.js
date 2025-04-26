import pool from '../config/db.js';

export const getRoles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};
