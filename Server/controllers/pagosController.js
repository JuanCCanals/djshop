import pool from '../config/db.js';
import { validationResult } from 'express-validator';

export const getPagos = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM pagos');
  res.json(rows);
};

export const createPago = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { usuario_id, monto, metodo_pago } = req.body;

  try {
    await pool.query(
      'INSERT INTO pagos (usuario_id, monto, metodo_pago, fecha_pago) VALUES (?, ?, ?, CURDATE())',
      [usuario_id, monto, metodo_pago]
    );
    res.json({ message: 'Pago registrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el pago' });
  }
};
