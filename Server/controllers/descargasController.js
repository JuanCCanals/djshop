// /app/DJSHOP/Server/controllers/descargasController.js

import pool from '../config/db.js';  // ajusta la ruta si fuese distinta

/**
 * GET /api/descargas
 * Devuelve todas las descargas
 */
export const getDescargas = async (req, res) => {
  try {
    // Obtiene todas las descargas
    const [rows] = await pool.query(
      `SELECT d.id_descarga, d.usuario_id, d.producto_id, d.tokens_gastados, d.fecha_descarga,
              u.nombre AS usuario, p.nombre AS producto
       FROM descargas d
       LEFT JOIN usuarios u ON d.usuario_id = u.id
       LEFT JOIN productos p ON d.producto_id = p.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener descargas:', err);
    res.status(500).json({ error: 'Error del servidor al listar descargas' });
  }
};

/**
 * POST /api/descargas
 * Registra una nueva descarga y descuenta tokens
 */
export const createDescarga = async (req, res) => {
  const { usuario_id, producto_id } = req.body;

  try {
    // 1. Traer precio en tokens del producto
    const [[producto]] = await pool.query(
      'SELECT precio FROM productos WHERE id = ?', [producto_id]
    );

    // 2. Traer suscripción activa
    const [[subs]] = await pool.query(
      `SELECT id_suscripcion, tokens_restantes
       FROM suscripciones
       WHERE usuario_id = ? AND estado = 'activa'`,
      [usuario_id]
    );

    if (!subs) {
      return res.status(400).json({ error: 'Sin suscripción activa' });
    }
    if (subs.tokens_restantes < producto.precio) {
      return res.status(400).json({ error: 'Créditos insuficientes' });
    }

    // 3. Registrar descarga
    await pool.query(
      `INSERT INTO descargas
         (usuario_id, producto_id, tokens_gastados, fecha_descarga)
       VALUES (?, ?, ?, NOW())`,
      [usuario_id, producto_id, producto.precio]
    );

    // 4. Descontar tokens
    const nuevoSaldo = subs.tokens_restantes - producto.precio;
    await pool.query(
      'UPDATE suscripciones SET tokens_restantes = ? WHERE id_suscripcion = ?',
      [nuevoSaldo, subs.id_suscripcion]
    );

    res.json({ message: 'Descarga registrada', saldo: nuevoSaldo });
  } catch (err) {
    console.error('Error al crear descarga:', err);
    res.status(500).json({ error: 'Error del servidor al registrar descarga' });
  }
};
