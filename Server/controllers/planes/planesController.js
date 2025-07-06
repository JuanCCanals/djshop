import pool from '../../config/db.js';
import { validationResult } from 'express-validator';

// Obtener todos los planes de suscripción
export const getPlanes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM planes_suscripcion');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ error: 'Error al obtener planes de suscripción' });
  }
};

// Obtener un plan específico por ID
export const getPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM planes_suscripcion WHERE id_plan = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({ error: 'Error al obtener el plan de suscripción' });
  }
};

// Crear un nuevo plan de suscripción
export const createPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { nombre, precio, tokens_asignados } = req.body;
  
  try {
    const [result] = await pool.query(
      'INSERT INTO planes_suscripcion (nombre, precio, tokens_asignados) VALUES (?, ?, ?)',
      [nombre, precio, tokens_asignados]
    );
    
    res.status(201).json({ 
      message: 'Plan de suscripción creado correctamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ error: 'Error al crear el plan de suscripción' });
  }
};

// Actualizar un plan de suscripción existente
export const updatePlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { nombre, precio, tokens_asignados } = req.body;
  
  try {
    const [result] = await pool.query(
      'UPDATE planes_suscripcion SET nombre = ?, precio = ?, tokens_asignados = ? WHERE id_plan = ?',
      [nombre, precio, tokens_asignados, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    
    res.json({ message: 'Plan de suscripción actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({ error: 'Error al actualizar el plan de suscripción' });
  }
};

// Eliminar un plan de suscripción
export const deletePlan = async (req, res) => {
  const { id } = req.params;
  
  try {
    const [result] = await pool.query('DELETE FROM planes_suscripcion WHERE id_plan = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    
    res.json({ message: 'Plan de suscripción eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar plan:', error);
    res.status(500).json({ error: 'Error al eliminar el plan de suscripción' });
  }
};

// Suscribir a un usuario a un plan (solicitud de suscripción pendiente de aprobación)
export const suscribirUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { usuario_id, plan_id, metodo_pago } = req.body;
  
  try {
    // Iniciar transacción
    await pool.query('START TRANSACTION');
    
    // 1. Obtener información del plan
    const [planes] = await pool.query('SELECT * FROM planes_suscripcion WHERE id_plan = ?', [plan_id]);
    
    if (planes.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    
    const plan = planes[0];
    
    // 2. Registrar el pago como pendiente
    const [resultPago] = await pool.query(
      'INSERT INTO pagos (usuario_id, plan_id, monto, metodo_pago, estado_pago, fecha_pago) VALUES (?, ?, ?, ?, ?, UNIX_TIMESTAMP())',
      [usuario_id, plan_id, plan.precio, metodo_pago, 'pendiente']
    );
    
    // 3. Calcular fechas de inicio y fin (1 mes de duración)
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    
    const fechaInicioSQL = fechaInicio.toISOString().split('T')[0];
    const fechaFinSQL = fechaFin.toISOString().split('T')[0];
    
    // 4. Crear la suscripción como pendiente
    const [resultSuscripcion] = await pool.query(
      'INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, tokens_restantes, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [usuario_id, plan_id, fechaInicioSQL, fechaFinSQL, 0, 'pendiente'] // Tokens en 0 hasta que se confirme el pago
    );
    
    // Confirmar transacción
    await pool.query('COMMIT');
    
    res.status(201).json({
      message: 'Solicitud de suscripción registrada correctamente. El administrador verificará el pago y activará su suscripción.',
      suscripcion_id: resultSuscripcion.insertId,
      pago_id: resultPago.insertId,
      plan: plan.nombre,
      precio: plan.precio,
      tokens_a_recibir: plan.tokens_asignados
    });
    
  } catch (error) {
    // Revertir transacción en caso de error
    await pool.query('ROLLBACK');
    console.error('Error al suscribir usuario:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud de suscripción' });
  }
};

// Verificar si un usuario tiene una suscripción activa
export const verificarSuscripcion = async (req, res) => {
  const { usuario_id } = req.params;
  
  try {
    const [suscripciones] = await pool.query(
      'SELECT s.*, p.nombre as plan_nombre, p.tokens_asignados ' +
      'FROM suscripciones s ' +
      'JOIN planes_suscripcion p ON s.plan_id = p.id_plan ' +
      'WHERE s.usuario_id = ? AND s.estado = "activa" AND s.fecha_fin >= CURDATE() ' +
      'ORDER BY s.fecha_fin DESC LIMIT 1',
      [usuario_id]
    );
    
    if (suscripciones.length === 0) {
      // Verificar si hay suscripciones pendientes
      const [pendientes] = await pool.query(
        'SELECT s.*, p.nombre as plan_nombre, p.tokens_asignados ' +
        'FROM suscripciones s ' +
        'JOIN planes_suscripcion p ON s.plan_id = p.id_plan ' +
        'WHERE s.usuario_id = ? AND s.estado = "pendiente" ' +
        'ORDER BY s.id_suscripcion DESC LIMIT 1',
        [usuario_id]
      );
      
      if (pendientes.length > 0) {
        return res.json({
          tiene_suscripcion: false,
          suscripcion_pendiente: true,
          mensaje: 'Tiene una solicitud de suscripción pendiente de aprobación',
          suscripcion: pendientes[0]
        });
      }
      
      return res.json({ 
        tiene_suscripcion: false,
        suscripcion_pendiente: false,
        mensaje: 'El usuario no tiene una suscripción activa'
      });
    }
    
    res.json({
      tiene_suscripcion: true,
      suscripcion_pendiente: false,
      suscripcion: suscripciones[0]
    });
    
  } catch (error) {
    console.error('Error al verificar suscripción:', error);
    res.status(500).json({ error: 'Error al verificar la suscripción del usuario' });
  }
};

// Actualizar tokens restantes de un usuario
export const actualizarTokens = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { usuario_id } = req.params;
  const { tokens_gastados } = req.body;
  
  try {
    // Obtener suscripción activa del usuario
    const [suscripciones] = await pool.query(
      'SELECT * FROM suscripciones WHERE usuario_id = ? AND estado = "activa" AND fecha_fin >= CURDATE() ORDER BY fecha_fin DESC LIMIT 1',
      [usuario_id]
    );
    
    if (suscripciones.length === 0) {
      return res.status(404).json({ error: 'No se encontró una suscripción activa para este usuario' });
    }
    
    const suscripcion = suscripciones[0];
    
    // Verificar si tiene suficientes tokens
    if (suscripcion.tokens_restantes < tokens_gastados) {
      return res.status(400).json({ 
        error: 'Tokens insuficientes',
        tokens_restantes: suscripcion.tokens_restantes,
        tokens_requeridos: tokens_gastados
      });
    }
    
    // Actualizar tokens restantes
    const nuevosTokens = suscripcion.tokens_restantes - tokens_gastados;
    await pool.query(
      'UPDATE suscripciones SET tokens_restantes = ? WHERE id_suscripcion = ?',
      [nuevosTokens, suscripcion.id_suscripcion]
    );
    
    res.json({
      message: 'Tokens actualizados correctamente',
      tokens_restantes: nuevosTokens,
      tokens_gastados: tokens_gastados
    });
    
  } catch (error) {
    console.error('Error al actualizar tokens:', error);
    res.status(500).json({ error: 'Error al actualizar los tokens del usuario' });
  }
};

// Asignación manual de tokens por parte del administrador
export const asignarTokensManual = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { usuario_id, tokens, admin_id, plan_id, activar_suscripcion } = req.body;
  
  try {
    // Verificar que el admin_id corresponda a un administrador
    const [admins] = await pool.query(
      'SELECT * FROM usuario WHERE id_usuario = ? AND rol_id = 1',
      [admin_id]
    );
    
    if (admins.length === 0) {
      return res.status(403).json({ error: 'No tiene permisos para realizar esta acción' });
    }
    
    // Iniciar transacción
    await pool.query('START TRANSACTION');
    
    if (activar_suscripcion && plan_id) {
      // Activar una suscripción pendiente
      const [suscripciones] = await pool.query(
        'SELECT * FROM suscripciones WHERE usuario_id = ? AND plan_id = ? AND estado = "pendiente" ORDER BY id_suscripcion DESC LIMIT 1',
        [usuario_id, plan_id]
      );
      
      if (suscripciones.length > 0) {
        const suscripcion = suscripciones[0];
        
        // Actualizar la suscripción a activa y asignar tokens
        await pool.query(
          'UPDATE suscripciones SET estado = "activa", tokens_restantes = ? WHERE id_suscripcion = ?',
          [tokens, suscripcion.id_suscripcion]
        );
        
        // Actualizar el pago a completado
        await pool.query(
          'UPDATE pagos SET estado_pago = "completado" WHERE usuario_id = ? AND plan_id = ? AND estado_pago = "pendiente" ORDER BY id_pago DESC LIMIT 1',
          [usuario_id, plan_id]
        );
        
        await pool.query('COMMIT');
        
        return res.json({
          message: 'Suscripción activada y tokens asignados correctamente',
          suscripcion_id: suscripcion.id_suscripcion,
          tokens_asignados: tokens
        });
      } else {
        // No hay suscripción pendiente, crear una nueva
        const [planes] = await pool.query('SELECT * FROM planes_suscripcion WHERE id_plan = ?', [plan_id]);
        
        if (planes.length === 0) {
          await pool.query('ROLLBACK');
          return res.status(404).json({ error: 'Plan no encontrado' });
        }
        
        // Calcular fechas de inicio y fin (1 mes de duración)
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        
        const fechaInicioSQL = fechaInicio.toISOString().split('T')[0];
        const fechaFinSQL = fechaFin.toISOString().split('T')[0];
        
        // Crear una nueva suscripción activa
        const [resultSuscripcion] = await pool.query(
          'INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, tokens_restantes, estado) VALUES (?, ?, ?, ?, ?, ?)',
          [usuario_id, plan_id, fechaInicioSQL, fechaFinSQL, tokens, 'activa']
        );
        
        // Registrar el pago como completado
        await pool.query(
          'INSERT INTO pagos (usuario_id, plan_id, monto, metodo_pago, estado_pago, fecha_pago) VALUES (?, ?, ?, ?, ?, UNIX_TIMESTAMP())',
          [usuario_id, plan_id, planes[0].precio, 'Transferencia', 'completado']
        );
        
        await pool.query('COMMIT');
        
        return res.json({
          message: 'Nueva suscripción creada y tokens asignados correctamente',
          suscripcion_id: resultSuscripcion.insertId,
          tokens_asignados: tokens
        });
      }
    } else {
      // Solo añadir tokens a una suscripción activa existente
      const [suscripciones] = await pool.query(
        'SELECT * FROM suscripciones WHERE usuario_id = ? AND estado = "activa" AND fecha_fin >= CURDATE() ORDER BY fecha_fin DESC LIMIT 1',
        [usuario_id]
      );
      
      if (suscripciones.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: 'No se encontró una suscripción activa para este usuario' });
      }
      
      const suscripcion = suscripciones[0];
      const nuevosTokens = suscripcion.tokens_restantes + tokens;
      
      // Actualizar tokens restantes
      await pool.query(
        'UPDATE suscripciones SET tokens_restantes = ? WHERE id_suscripcion = ?',
        [nuevosTokens, suscripcion.id_suscripcion]
      );
      
      // Registrar la recarga de tokens
      await pool.query(
        'INSERT INTO pagos (usuario_id, plan_id, monto, metodo_pago, estado_pago, fecha_pago) VALUES (?, ?, ?, ?, ?, UNIX_TIMESTAMP())',
        [usuario_id, suscripcion.plan_id, tokens, 'Recarga manual', 'completado']
      );
      
      await pool.query('COMMIT');
      
      return res.json({
        message: 'Tokens añadidos correctamente a la suscripción existente',
        suscripcion_id: suscripcion.id_suscripcion,
        tokens_anteriores: suscripcion.tokens_restantes,
        tokens_nuevos: nuevosTokens,
        tokens_anadidos: tokens
      });
    }
    
  } catch (error) {
    // Revertir transacción en caso de error
    await pool.query('ROLLBACK');
    console.error('Error al asignar tokens manualmente:', error);
    res.status(500).json({ error: 'Error al asignar tokens al usuario' });
  }
};
