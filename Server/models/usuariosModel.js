import db from '../config/db.js';

// Obtener todos los usuarios
export const getUsuarios = (callback) => {
    const query = `
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.foto, 
               u.rol_id, r.nombre as rol_nombre
        FROM usuario u
        LEFT JOIN roles r ON u.rol_id = r.id_rol
        ORDER BY u.id_usuario DESC
    `;
    db.query(query, callback);
};

// Obtener usuario por ID
export const getUsuarioById = (id, callback) => {
    const query = `
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.foto, 
               u.rol_id, r.nombre as rol_nombre
        FROM usuario u
        LEFT JOIN roles r ON u.rol_id = r.id_rol
        WHERE u.id_usuario = ?
    `;
    db.query(query, [id], callback);
};

// Obtener usuario por email
export const getUsuarioByEmail = (email, callback) => {
    const query = `
        SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.password, u.foto, 
               u.rol_id, r.nombre as rol_nombre
        FROM usuario u
        LEFT JOIN roles r ON u.rol_id = r.id_rol
        WHERE u.correo = ?
    `;
    db.query(query, [email], callback);
};

// Crear nuevo usuario
export const createUsuario = (usuarioData, callback) => {
    const query = `
        INSERT INTO usuario (nombre, apellido, correo, password, foto, rol_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        usuarioData.nombre,
        usuarioData.apellido || '',
        usuarioData.correo,
        usuarioData.password,
        usuarioData.foto || '',
        usuarioData.rol_id || 2 // Por defecto rol cliente
    ];
    db.query(query, values, callback);
};

// Actualizar usuario
export const updateUsuario = (id, usuarioData, callback) => {
    const query = `
        UPDATE usuario 
        SET nombre = ?, apellido = ?, correo = ?, foto = ?, rol_id = ?
        WHERE id_usuario = ?
    `;
    const values = [
        usuarioData.nombre,
        usuarioData.apellido,
        usuarioData.correo,
        usuarioData.foto,
        usuarioData.rol_id,
        id
    ];
    db.query(query, values, callback);
};

// Actualizar password del usuario
export const updatePassword = (id, hashedPassword, callback) => {
    const query = 'UPDATE usuario SET password = ? WHERE id_usuario = ?';
    db.query(query, [hashedPassword, id], callback);
};

// Eliminar usuario
export const deleteUsuario = (id, callback) => {
    const query = 'DELETE FROM usuario WHERE id_usuario = ?';
    db.query(query, [id], callback);
};

// Verificar si el email ya existe
export const emailExists = (email, callback) => {
    const query = 'SELECT COUNT(*) as count FROM usuario WHERE correo = ?';
    db.query(query, [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0].count > 0);
    });
};

// Obtener estadísticas de usuarios
export const getEstadisticasUsuarios = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as total_usuarios,
            COUNT(CASE WHEN rol_id = 1 THEN 1 END) as total_admins,
            COUNT(CASE WHEN rol_id = 2 THEN 1 END) as total_clientes
        FROM usuario
    `;
    db.query(query, callback);
};

