import db from '../config/db.js';

// Obtener todos los planes de suscripción
export const getPlanes = (callback) => {
    const query = `
        SELECT id_plan, nombre, precio, tokens_asignados
        FROM planes_suscripcion
        ORDER BY precio ASC
    `;
    db.query(query, callback);
};

// Obtener plan por ID
export const getPlanById = (id, callback) => {
    const query = `
        SELECT id_plan, nombre, precio, tokens_asignados
        FROM planes_suscripcion
        WHERE id_plan = ?
    `;
    db.query(query, [id], callback);
};

// Crear nuevo plan
export const createPlan = (planData, callback) => {
    const query = `
        INSERT INTO planes_suscripcion (nombre, precio, tokens_asignados)
        VALUES (?, ?, ?)
    `;
    const values = [
        planData.nombre,
        planData.precio,
        planData.tokens_asignados
    ];
    db.query(query, values, callback);
};

// Actualizar plan
export const updatePlan = (id, planData, callback) => {
    const query = `
        UPDATE planes_suscripcion 
        SET nombre = ?, precio = ?, tokens_asignados = ?
        WHERE id_plan = ?
    `;
    const values = [
        planData.nombre,
        planData.precio,
        planData.tokens_asignados,
        id
    ];
    db.query(query, values, callback);
};

// Eliminar plan
export const deletePlan = (id, callback) => {
    const query = 'DELETE FROM planes_suscripcion WHERE id_plan = ?';
    db.query(query, [id], callback);
};

// Obtener estadísticas de planes
export const getEstadisticasPlanes = (callback) => {
    const query = `
        SELECT 
            COUNT(*) as total_planes,
            AVG(precio) as precio_promedio,
            MIN(precio) as precio_minimo,
            MAX(precio) as precio_maximo,
            SUM(tokens_asignados) as total_tokens
        FROM planes_suscripcion
    `;
    db.query(query, callback);
};

