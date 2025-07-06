import db from '../config/db.js';

// Obtener todos los géneros
export const getGeneros = (callback) => {
    const query = 'SELECT id, nombre FROM genero ORDER BY nombre';
    db.query(query, callback);
};

// Obtener género por ID
export const getGeneroById = (id, callback) => {
    const query = 'SELECT id, nombre FROM genero WHERE id = ?';
    db.query(query, [id], callback);
};

// Crear nuevo género
export const createGenero = (nombre, callback) => {
    const query = 'INSERT INTO genero (nombre) VALUES (?)';
    db.query(query, [nombre], callback);
};

// Actualizar género
export const updateGenero = (id, nombre, callback) => {
    const query = 'UPDATE genero SET nombre = ? WHERE id = ?';
    db.query(query, [nombre, id], callback);
};

// Eliminar género
export const deleteGenero = (id, callback) => {
    const query = 'DELETE FROM genero WHERE id = ?';
    db.query(query, [id], callback);
};
