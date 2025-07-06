import db from '../config/db.js';

// Obtener todas las pistas/productos
export const getPistas = (callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE p.estado = 'activo'
        ORDER BY p.created_at DESC
    `;
    db.query(query, callback);
};

// Obtener pistas por tipo (audio/video)
export const getPistasByTipo = (tipo, callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE p.tipo = ? AND p.estado = 'activo'
        ORDER BY p.created_at DESC
    `;
    db.query(query, [tipo], callback);
};

// Obtener pistas por género
export const getPistasByGenero = (generoId, callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE p.genero_id = ? AND p.estado = 'activo'
        ORDER BY p.created_at DESC
    `;
    db.query(query, [generoId], callback);
};

// Obtener pistas destacadas (las más recientes)
export const getPistasDestacadas = (limit = 6, callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE p.estado = 'activo'
        ORDER BY p.created_at DESC
        LIMIT ?
    `;
    db.query(query, [limit], callback);
};

// Obtener pista por ID
export const getPistaById = (id, callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE p.id = ?
    `;
    db.query(query, [id], callback);
};

// Crear nueva pista/producto
export const createPista = (pistaData, callback) => {
    const query = `
        INSERT INTO productos (nombre, genero_id, artista, tipo, pista, cancion, duracion, precio, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        pistaData.nombre,
        pistaData.genero_id,
        pistaData.artista,
        pistaData.tipo,
        pistaData.pista,
        pistaData.cancion,
        pistaData.duracion,
        pistaData.precio,
        pistaData.estado || 'activo'
    ];
    db.query(query, values, callback);
};

// Actualizar pista/producto
export const updatePista = (id, pistaData, callback) => {
    const query = `
        UPDATE productos 
        SET nombre = ?, genero_id = ?, artista = ?, tipo = ?, 
            pista = ?, cancion = ?, duracion = ?, precio = ?, estado = ?
        WHERE id = ?
    `;
    const values = [
        pistaData.nombre,
        pistaData.genero_id,
        pistaData.artista,
        pistaData.tipo,
        pistaData.pista,
        pistaData.cancion,
        pistaData.duracion,
        pistaData.precio,
        pistaData.estado,
        id
    ];
    db.query(query, values, callback);
};

// Eliminar pista/producto (cambiar estado a inactivo)
export const deletePista = (id, callback) => {
    const query = 'UPDATE productos SET estado = "inactivo" WHERE id = ?';
    db.query(query, [id], callback);
};

// Buscar pistas por texto
export const searchPistas = (searchTerm, callback) => {
    const query = `
        SELECT p.id, p.nombre, p.genero_id, g.nombre as genero_nombre, 
               p.artista, p.tipo, p.pista, p.cancion, p.duracion, 
               p.precio, p.estado, p.created_at, p.updated_at
        FROM productos p
        LEFT JOIN genero g ON p.genero_id = g.id
        WHERE (p.nombre LIKE ? OR p.artista LIKE ? OR g.nombre LIKE ?) 
              AND p.estado = 'activo'
        ORDER BY p.created_at DESC
    `;
    const searchPattern = `%${searchTerm}%`;
    db.query(query, [searchPattern, searchPattern, searchPattern], callback);
};

