import * as pistasModel from '../models/pistasModel.js';

// Obtener todas las pistas
export const getAllPistas = (req, res) => {
    pistasModel.getPistas((err, results) => {
        if (err) {
            console.error('Error al obtener pistas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener pistas por tipo (audio/video)
export const getPistasByTipo = (req, res) => {
    const { tipo } = req.params;

    if (!['audio', 'video'].includes(tipo)) {
        return res.status(400).json({ error: 'Tipo inválido. Debe ser "audio" o "video"' });
    }

    pistasModel.getPistasByTipo(tipo, (err, results) => {
        if (err) {
            console.error('Error al obtener pistas por tipo:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener pistas por género
export const getPistasByGenero = (req, res) => {
    const { generoId } = req.params;

    pistasModel.getPistasByGenero(generoId, (err, results) => {
        if (err) {
            console.error('Error al obtener pistas por género:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener pistas destacadas
export const getPistasDestacadas = (req, res) => {
    const limit = parseInt(req.query.limit) || 6;

    pistasModel.getPistasDestacadas(limit, (err, results) => {
        if (err) {
            console.error('Error al obtener pistas destacadas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener pista por ID
export const getPistaById = (req, res) => {
    const { id } = req.params;

    pistasModel.getPistaById(id, (err, results) => {
        if (err) {
            console.error('Error al obtener pista:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Pista no encontrada' });
        }
        
        res.json(results[0]);
    });
};

// Crear nueva pista
export const createPista = (req, res) => {
    const pistaData = req.body;

    // Validaciones básicas
    if (!pistaData.nombre || !pistaData.artista || !pistaData.tipo || !pistaData.genero_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    pistasModel.createPista(pistaData, (err, results) => {
        if (err) {
            console.error('Error al crear pista:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json({ 
            message: 'Pista creada exitosamente', 
            id: results.insertId 
        });
    });
};

// Actualizar pista
export const updatePista = (req, res) => {
    const { id } = req.params;
    const pistaData = req.body;

    pistasModel.updatePista(id, pistaData, (err, results) => {
        if (err) {
            console.error('Error al actualizar pista:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Pista no encontrada' });
        }
        
        res.json({ message: 'Pista actualizada exitosamente' });
    });
};

// Eliminar pista (cambiar estado a inactivo)
export const deletePista = (req, res) => {
    const { id } = req.params;

    pistasModel.deletePista(id, (err, results) => {
        if (err) {
            console.error('Error al eliminar pista:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Pista no encontrada' });
        }
        
        res.json({ message: 'Pista eliminada exitosamente' });
    });
};

// Buscar pistas
export const searchPistas = (req, res) => {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'El término de búsqueda debe tener al menos 2 caracteres' });
    }

    pistasModel.searchPistas(q.trim(), (err, results) => {
        if (err) {
            console.error('Error al buscar pistas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

