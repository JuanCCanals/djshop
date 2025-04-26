import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const getDescargas = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM descargas');
  res.json(rows);
};

export const createDescarga = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { usuario_id, producto_id, tokens_gastados } = req.body;

  try {
    await pool.query(
      'INSERT INTO descargas (usuario_id, producto_id, tokens_gastados, fecha_descarga) VALUES (?, ?, ?, CURDATE())',
      [usuario_id, producto_id, tokens_gastados]
    );
    res.json({ message: 'Descarga registrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la descarga' });
  }
};
