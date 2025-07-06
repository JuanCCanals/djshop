import db from '../config/db.js';

// Obtener todas las suscripciones
export const getSuscripciones = (callback) => {
    const query = `
        SELECT s.id_suscripcion, s.usuario_id, s.plan_id, s.fecha_inicio, s.fecha_fin, 
               s.tokens_restantes, s.estado,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.correo as usuario_email,
               p.nombre as plan_nombre, p.precio as plan_precio, p.tokens_asignados
        FROM suscripciones s
        LEFT JOIN usuario u ON s.usuario_id = u.id_usuario
        LEFT JOIN planes_suscripcion p ON s.plan_id = p.id_plan
        ORDER BY s.fecha_inicio DESC
    `;
    db.query(query, callback);
};

// Obtener suscripciones por usuario
export const getSuscripcionesByUsuario = (usuarioId, callback) => {
    const query = `
        SELECT s.id_suscripcion, s.usuario_id, s.plan_id, s.fecha_inicio, s.fecha_fin, 
               s.tokens_restantes, s.estado,
               p.nombre as plan_nombre, p.precio as plan_precio, p.tokens_asignados
        FROM suscripciones s
        LEFT JOIN planes_suscripcion p ON s.plan_id = p.id_plan
        WHERE s.usuario_id = ?
        ORDER BY s.fecha_inicio DESC
    `;
    db.query(query, [usuarioId], callback);
};

// Obtener suscripción activa por usuario
export const getSuscripcionActivaByUsuario = (usuarioId, callback) => {
    const query = `
        SELECT s.id_suscripcion, s.usuario_id, s.plan_id, s.fecha_inicio, s.fecha_fin, 
               s.tokens_restantes, s.estado,
               p.nombre as plan_nombre, p.precio as plan_precio, p.tokens_asignados
        FROM suscripciones s
        LEFT JOIN planes_suscripcion p ON s.plan_id = p.id_plan
        WHERE s.usuario_id = ? AND s.estado = 'activa' AND s.fecha_fin >= CURDATE()
        ORDER BY s.fecha_inicio DESC
        LIMIT 1
    `;
    db.query(query, [usuarioId], callback);
};

// Obtener suscripción por ID
export const getSuscripcionById = (id, callback) => {
    const query = `
        SELECT s.id_suscripcion, s.usuario_id, s.plan_id, s.fecha_inicio, s.fecha_fin, 
               s.tokens_restantes, s.estado,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.correo as usuario_email,
               p.nombre as plan_nombre, p.precio as plan_precio, p.tokens_asignados
        FROM suscripciones s
        LEFT JOIN usuario u ON s.usuario_id = u.id_usuario
        LEFT JOIN planes_suscripcion p ON s.plan_id = p.id_plan
        WHERE s.id_suscripcion = ?
    `;
    db.query(query, [id], callback);
};

// Crear nueva suscripción
export const createSuscripcion = (suscripcionData, callback) => {
    const query = `
        INSERT INTO suscripciones (usuario_id, plan_id, fecha_inicio, fecha_fin, tokens_restantes, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        suscripcionData.usuario_id,
        suscripcionData.plan_id,
        suscripcionData.fecha_inicio,
        suscripcionData.fecha_fin,
        suscripcionData.tokens_restantes,
        suscripcionData.estado || 'activa'
    ];
    db.query(query, values, callback);
};

// Actualizar suscripción
export const updateSuscripcion = (id, suscripcionData, callback) => {
    const query = `
        UPDATE suscripciones 
        SET fecha_inicio = ?, fecha_fin = ?, tokens_restantes = ?, estado = ?
        WHERE id_suscripcion = ?
    `;
    const values = [
        suscripcionData.fecha_inicio,
        suscripcionData.fecha_fin,
        suscripcionData.tokens_restantes,
        suscripcionData.estado,
        id
    ];
    db.query(query, values, callback);
};

// Actualizar tokens restantes de una suscripción
export const updateTokensRestantes = (id, tokensRestantes, callback) => {
    const query = 'UPDATE suscripciones SET tokens_restantes = ? WHERE id_suscripcion = ?';
    db.query(query, [tokensRestantes, id], callback);
};

// Descontar tokens de una suscripción
export const descontarTokens = (usuarioId, tokensADescontar, callback) => {
    const query = `
        UPDATE suscripciones 
        SET tokens_restantes = tokens_restantes - ?
        WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE() AND tokens_restantes >= ?
        ORDER BY fecha_fin ASC
        LIMIT 1
    `;
    db.query(query, [tokensADescontar, usuarioId, tokensADescontar], callback);
};

// Verificar si el usuario tiene tokens suficientes
export const verificarTokensSuficientes = (usuarioId, tokensNecesarios, callback) => {
    const query = `
        SELECT SUM(tokens_restantes) as total_tokens
        FROM suscripciones 
        WHERE usuario_id = ? AND estado = 'activa' AND fecha_fin >= CURDATE()
    `;
    db.query(query, [usuarioId], (err, results) => {
        if (err) return callback(err);
        const totalTokens = results[0].total_tokens || 0;
        callback(null, totalTokens >= tokensNecesarios);
    });
};

// Cancelar suscripción
export const cancelarSuscripcion = (id, callback) => {
    const query = 'UPDATE suscripciones SET estado = "cancelada" WHERE id_suscripcion = ?';
    db.query(query, [id], callback);
};

// Expirar suscripciones vencidas
export const expirarSuscripcionesVencidas = (callback) => {
    const query = `
        UPDATE suscripciones 
        SET estado = 'expirada' 
        WHERE fecha_fin < CURDATE() AND estado = 'activa'
    `;
    db.query(query, callback);
};

// Obtener estadísticas de suscripciones
export const getEstadisticasSuscripciones = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as total_suscripciones,
            COUNT(CASE WHEN estado = 'activa' THEN 1 END) as suscripciones_activas,
            COUNT(CASE WHEN estado = 'expirada' THEN 1 END) as suscripciones_expiradas,
            COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as suscripciones_canceladas,
            SUM(tokens_restantes) as total_tokens_restantes
        FROM suscripciones
    `;
    db.query(query, callback);
};

