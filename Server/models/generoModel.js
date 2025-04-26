import db from '../config/db.js';

export const getGeneros = (callback) => {
    db.query('SELECT * FROM genero', callback);
};

export const createGenero = (nombre, callback) => {
    db.query('INSERT INTO genero (nombre) VALUES (?)', [nombre], callback);
};

export const updateGenero = (id, nombre, callback) => {
    db.query('UPDATE genero SET nombre = ? WHERE id = ?', [nombre, id], callback);
};

export const deleteGenero = (id, callback) => {
    db.query('DELETE FROM genero WHERE id = ?', [id], callback);
};
