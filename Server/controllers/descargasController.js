export const createDescarga = async (req,res)=>{
  const { usuario_id, producto_id } = req.body;

  // 1. Traer precio en tokens del producto (1 token = S/ 1 por ahora)
  const [[producto]] = await pool.query(
    'SELECT precio FROM productos WHERE id = ?', [producto_id]);

  // 2. Traer suscripción activa
  const [[subs]] = await pool.query(
    `SELECT id_suscripcion, tokens_restantes
     FROM suscripciones
     WHERE usuario_id = ? AND estado = 'activa'`, [usuario_id]);

  if (!subs) return res.status(400).json({ error:'Sin suscripción activa' });
  if (subs.tokens_restantes < producto.precio)
      return res.status(400).json({ error:'Créditos insuficientes' });

  // 3. Registrar descarga
  await pool.query(
    `INSERT INTO descargas (usuario_id, producto_id, tokens_gastados, fecha_descarga)
     VALUES (?,?,?, NOW())`,
     [usuario_id, producto_id, producto.precio]);

  // 4. Descontar tokens
  await pool.query(
    'UPDATE suscripciones SET tokens_restantes = tokens_restantes - ? WHERE id_suscripcion = ?',
    [producto.precio, subs.id_suscripcion]);

  res.json({ message:'Descarga registrada', saldo: subs.tokens_restantes - producto.precio });
};
