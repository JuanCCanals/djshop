import { getGeneros, createGenero, updateGenero, deleteGenero } from '../models/generoModel.js';

export const obtenerGeneros = (req, res) => {
    getGeneros((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

export const agregarGenero = (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    createGenero(nombre, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Género agregado', id: result.insertId });
    });
};

export const actualizarGenero = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

    updateGenero(id, nombre, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Género actualizado' });
    });
};

export const eliminarGenero = (req, res) => {
    const { id } = req.params;
    deleteGenero(id, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Género eliminado' });
    });
};
