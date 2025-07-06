import * as comprasModel from '../models/comprasModel.js';

// Obtener todas las compras/descargas
export const getAllCompras = (req, res) => {
    comprasModel.getCompras((err, results) => {
        if (err) {
            console.error('Error al obtener compras:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener compras por usuario
export const getComprasByUsuario = (req, res) => {
    const { usuarioId } = req.params;

    comprasModel.getComprasByUsuario(usuarioId, (err, results) => {
        if (err) {
            console.error('Error al obtener compras del usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener compra por ID
export const getCompraById = (req, res) => {
    const { id } = req.params;

    comprasModel.getCompraById(id, (err, results) => {
        if (err) {
            console.error('Error al obtener compra:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }
        
        res.json(results[0]);
    });
};

// Crear nueva compra/descarga
export const createCompra = (req, res) => {
    const compraData = req.body;

    // Validaciones básicas
    if (!compraData.usuario_id || !compraData.producto_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si ya compró esta pista
    comprasModel.verificarCompraExistente(compraData.usuario_id, compraData.producto_id, (err, yaCompro) => {
        if (err) {
            console.error('Error al verificar compra existente:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (yaCompro) {
            return res.status(400).json({ error: 'Ya has descargado esta pista anteriormente' });
        }

        // Crear la compra/descarga
        comprasModel.createCompra(compraData, (err, results) => {
            if (err) {
                console.error('Error al crear compra:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            res.status(201).json({ 
                message: 'Descarga registrada exitosamente', 
                id: results.insertId 
            });
        });
    });
};

// Eliminar compra/descarga
export const deleteCompra = (req, res) => {
    const { id } = req.params;

    comprasModel.deleteCompra(id, (err, results) => {
        if (err) {
            console.error('Error al eliminar compra:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Compra no encontrada' });
        }
        
        res.json({ message: 'Compra eliminada exitosamente' });
    });
};

// Obtener estadísticas de compras
export const getEstadisticasCompras = (req, res) => {
    comprasModel.getEstadisticasCompras((err, results) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results[0]);
    });
};

// Obtener compras por rango de fechas
export const getComprasByFecha = (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fechas de inicio y fin son requeridas' });
    }

    comprasModel.getComprasByFecha(fechaInicio, fechaFin, (err, results) => {
        if (err) {
            console.error('Error al obtener compras por fecha:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

