import db from '../config/db.js';

// Obtener todas las descargas/compras
export const getCompras = (callback) => {
    const query = `
        SELECT d.id_descarga, d.usuario_id, d.producto_id, d.tokens_gastados, d.fecha_descarga,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.correo as usuario_email,
               p.nombre as producto_nombre, p.artista, p.tipo, p.precio
        FROM descargas d
        LEFT JOIN usuario u ON d.usuario_id = u.id_usuario
        LEFT JOIN productos p ON d.producto_id = p.id
        ORDER BY d.fecha_descarga DESC
    `;
    db.query(query, callback);
};

// Obtener compras/descargas por usuario
export const getComprasByUsuario = (usuarioId, callback) => {
    const query = `
        SELECT d.id_descarga, d.usuario_id, d.producto_id, d.tokens_gastados, d.fecha_descarga,
               p.nombre as producto_nombre, p.artista, p.tipo, p.precio, p.pista, p.cancion
        FROM descargas d
        LEFT JOIN productos p ON d.producto_id = p.id
        WHERE d.usuario_id = ?
        ORDER BY d.fecha_descarga DESC
    `;
    db.query(query, [usuarioId], callback);
};

// Obtener descarga por ID
export const getCompraById = (id, callback) => {
    const query = `
        SELECT d.id_descarga, d.usuario_id, d.producto_id, d.tokens_gastados, d.fecha_descarga,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido, u.correo as usuario_email,
               p.nombre as producto_nombre, p.artista, p.tipo, p.precio, p.pista, p.cancion
        FROM descargas d
        LEFT JOIN usuario u ON d.usuario_id = u.id_usuario
        LEFT JOIN productos p ON d.producto_id = p.id
        WHERE d.id_descarga = ?
    `;
    db.query(query, [id], callback);
};

// Crear nueva descarga/compra
export const createCompra = (compraData, callback) => {
    const query = `
        INSERT INTO descargas (usuario_id, producto_id, tokens_gastados, fecha_descarga)
        VALUES (?, ?, ?, ?)
    `;
    const values = [
        compraData.usuario_id,
        compraData.producto_id,
        compraData.tokens_gastados || 1,
        compraData.fecha_descarga || new Date().toISOString().split('T')[0]
    ];
    db.query(query, values, callback);
};

// Verificar si el usuario ya compró/descargó esta pista
export const verificarCompraExistente = (usuarioId, productoId, callback) => {
    const query = `
        SELECT COUNT(*) as count 
        FROM descargas 
        WHERE usuario_id = ? AND producto_id = ?
    `;
    db.query(query, [usuarioId, productoId], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].count > 0);
    });
};

// Eliminar descarga/compra
export const deleteCompra = (id, callback) => {
    const query = 'DELETE FROM descargas WHERE id_descarga = ?';
    db.query(query, [id], callback);
};

// Obtener estadísticas de compras/descargas
export const getEstadisticasCompras = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as total_descargas,
            COUNT(DISTINCT usuario_id) as usuarios_activos,
            COUNT(DISTINCT producto_id) as productos_descargados,
            SUM(tokens_gastados) as total_tokens_gastados,
            AVG(tokens_gastados) as promedio_tokens_por_descarga
        FROM descargas
    `;
    db.query(query, callback);
};

// Obtener descargas por fecha
export const getComprasByFecha = (fechaInicio, fechaFin, callback) => {
    const query = `
        SELECT d.id_descarga, d.usuario_id, d.producto_id, d.tokens_gastados, d.fecha_descarga,
               u.nombre as usuario_nombre, u.apellido as usuario_apellido,
               p.nombre as producto_nombre, p.artista, p.tipo
        FROM descargas d
        LEFT JOIN usuario u ON d.usuario_id = u.id_usuario
        LEFT JOIN productos p ON d.producto_id = p.id
        WHERE d.fecha_descarga BETWEEN ? AND ?
        ORDER BY d.fecha_descarga DESC
    `;
    db.query(query, [fechaInicio, fechaFin], callback);
};

