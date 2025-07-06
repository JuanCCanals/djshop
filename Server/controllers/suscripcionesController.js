import * as suscripcionesModel from '../models/suscripcionesModel.js';

// Obtener todas las suscripciones
export const getAllSuscripciones = (req, res) => {
    suscripcionesModel.getSuscripciones((err, results) => {
        if (err) {
            console.error('Error al obtener suscripciones:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener suscripciones por usuario
export const getSuscripcionesByUsuario = (req, res) => {
    const { usuarioId } = req.params;

    suscripcionesModel.getSuscripcionesByUsuario(usuarioId, (err, results) => {
        if (err) {
            console.error('Error al obtener suscripciones del usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener suscripción activa por usuario
export const getSuscripcionActivaByUsuario = (req, res) => {
    const { usuarioId } = req.params;

    suscripcionesModel.getSuscripcionActivaByUsuario(usuarioId, (err, results) => {
        if (err) {
            console.error('Error al obtener suscripción activa:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'No tiene suscripción activa' });
        }
        
        res.json(results[0]);
    });
};

// Obtener suscripción por ID
export const getSuscripcionById = (req, res) => {
    const { id } = req.params;

    suscripcionesModel.getSuscripcionById(id, (err, results) => {
        if (err) {
            console.error('Error al obtener suscripción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }
        
        res.json(results[0]);
    });
};

// Crear nueva suscripción
export const createSuscripcion = (req, res) => {
    const suscripcionData = req.body;

    // Validaciones básicas
    if (!suscripcionData.usuario_id || !suscripcionData.plan_id) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Establecer fechas por defecto si no se proporcionan
    if (!suscripcionData.fecha_inicio) {
        suscripcionData.fecha_inicio = new Date().toISOString().split('T')[0];
    }
    
    if (!suscripcionData.fecha_fin) {
        const fechaFin = new Date();
        fechaFin.setMonth(fechaFin.getMonth() + 1); // 1 mes por defecto
        suscripcionData.fecha_fin = fechaFin.toISOString().split('T')[0];
    }

    suscripcionesModel.createSuscripcion(suscripcionData, (err, results) => {
        if (err) {
            console.error('Error al crear suscripción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json({ 
            message: 'Suscripción creada exitosamente', 
            id: results.insertId 
        });
    });
};

// Actualizar suscripción
export const updateSuscripcion = (req, res) => {
    const { id } = req.params;
    const suscripcionData = req.body;

    suscripcionesModel.updateSuscripcion(id, suscripcionData, (err, results) => {
        if (err) {
            console.error('Error al actualizar suscripción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }
        
        res.json({ message: 'Suscripción actualizada exitosamente' });
    });
};

// Actualizar tokens restantes
export const updateTokensRestantes = (req, res) => {
    const { id } = req.params;
    const { tokens_restantes } = req.body;

    if (tokens_restantes === undefined || tokens_restantes < 0) {
        return res.status(400).json({ error: 'Cantidad de tokens inválida' });
    }

    suscripcionesModel.updateTokensRestantes(id, tokens_restantes, (err, results) => {
        if (err) {
            console.error('Error al actualizar tokens:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }
        
        res.json({ message: 'Tokens actualizados exitosamente' });
    });
};

// Descontar tokens
export const descontarTokens = (req, res) => {
    const { usuarioId } = req.params;
    const { tokens } = req.body;

    if (!tokens || tokens <= 0) {
        return res.status(400).json({ error: 'Cantidad de tokens inválida' });
    }

    // Verificar si tiene tokens suficientes
    suscripcionesModel.verificarTokensSuficientes(usuarioId, tokens, (err, tieneSuficientes) => {
        if (err) {
            console.error('Error al verificar tokens:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (!tieneSuficientes) {
            return res.status(400).json({ error: 'Tokens insuficientes' });
        }

        // Descontar los tokens
        suscripcionesModel.descontarTokens(usuarioId, tokens, (err, results) => {
            if (err) {
                console.error('Error al descontar tokens:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: 'No se pudieron descontar los tokens' });
            }
            
            res.json({ message: 'Tokens descontados exitosamente' });
        });
    });
};

// Cancelar suscripción
export const cancelarSuscripcion = (req, res) => {
    const { id } = req.params;

    suscripcionesModel.cancelarSuscripcion(id, (err, results) => {
        if (err) {
            console.error('Error al cancelar suscripción:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }
        
        res.json({ message: 'Suscripción cancelada exitosamente' });
    });
};

// Expirar suscripciones vencidas
export const expirarSuscripcionesVencidas = (req, res) => {
    suscripcionesModel.expirarSuscripcionesVencidas((err, results) => {
        if (err) {
            console.error('Error al expirar suscripciones:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.json({ 
            message: 'Suscripciones expiradas actualizadas', 
            suscripciones_expiradas: results.affectedRows 
        });
    });
};

// Obtener estadísticas de suscripciones
export const getEstadisticasSuscripciones = (req, res) => {
    suscripcionesModel.getEstadisticasSuscripciones((err, results) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results[0]);
    });
};

