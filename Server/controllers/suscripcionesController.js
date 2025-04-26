import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const getSuscripciones = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suscripciones');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener suscripciones' });
  }
};

export const createSuscripcion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { usuario_id, plan } = req.body;

  try {
    await pool.query(
      'INSERT INTO suscripciones (usuario_id, plan, fecha_inicio) VALUES (?, ?, CURDATE())',
      [usuario_id, plan]
    );
    res.json({ message: 'Suscripción creada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la suscripción' });
  }
};
