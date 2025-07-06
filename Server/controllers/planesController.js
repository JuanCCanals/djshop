import * as planesModel from '../models/planesModel.js';

// Obtener todos los planes
export const getAllPlanes = (req, res) => {
    planesModel.getPlanes((err, results) => {
        if (err) {
            console.error('Error al obtener planes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener plan por ID
export const getPlanById = (req, res) => {
    const { id } = req.params;

    planesModel.getPlanById(id, (err, results) => {
        if (err) {
            console.error('Error al obtener plan:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Plan no encontrado' });
        }
        
        res.json(results[0]);
    });
};

// Crear nuevo plan
export const createPlan = (req, res) => {
    const planData = req.body;

    // Validaciones básicas
    if (!planData.nombre || !planData.precio || !planData.tokens_asignados) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    planesModel.createPlan(planData, (err, results) => {
        if (err) {
            console.error('Error al crear plan:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json({ 
            message: 'Plan creado exitosamente', 
            id: results.insertId 
        });
    });
};

// Actualizar plan
export const updatePlan = (req, res) => {
    const { id } = req.params;
    const planData = req.body;

    planesModel.updatePlan(id, planData, (err, results) => {
        if (err) {
            console.error('Error al actualizar plan:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Plan no encontrado' });
        }
        
        res.json({ message: 'Plan actualizado exitosamente' });
    });
};

// Eliminar plan
export const deletePlan = (req, res) => {
    const { id } = req.params;

    planesModel.deletePlan(id, (err, results) => {
        if (err) {
            console.error('Error al eliminar plan:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Plan no encontrado' });
        }
        
        res.json({ message: 'Plan eliminado exitosamente' });
    });
};

// Obtener estadísticas de planes
export const getEstadisticasPlanes = (req, res) => {
    planesModel.getEstadisticasPlanes((err, results) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results[0]);
    });
};

