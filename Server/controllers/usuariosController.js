import * as usuariosModel from '../models/usuariosModel.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getAllUsuarios = (req, res) => {
    usuariosModel.getUsuarios((err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results);
    });
};

// Obtener usuario por ID
export const getUsuarioById = (req, res) => {
    const { id } = req.params;

    usuariosModel.getUsuarioById(id, (err, results) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json(results[0]);
    });
};

// Crear nuevo usuario
export const createUsuario = (req, res) => {
    const usuarioData = req.body;

    // Validaciones básicas
    if (!usuarioData.nombre || !usuarioData.correo || !usuarioData.password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Verificar si el email ya existe
    usuariosModel.emailExists(usuarioData.correo, (err, exists) => {
        if (err) {
            console.error('Error al verificar email:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (exists) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Encriptar password
        bcrypt.hash(usuarioData.password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error al encriptar password:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            usuarioData.password = hashedPassword;

            usuariosModel.createUsuario(usuarioData, (err, results) => {
                if (err) {
                    console.error('Error al crear usuario:', err);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }
                
                res.status(201).json({ 
                    message: 'Usuario creado exitosamente', 
                    id: results.insertId 
                });
            });
        });
    });
};

// Actualizar usuario
export const updateUsuario = (req, res) => {
    const { id } = req.params;
    const usuarioData = req.body;

    usuariosModel.updateUsuario(id, usuarioData, (err, results) => {
        if (err) {
            console.error('Error al actualizar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario actualizado exitosamente' });
    });
};

// Actualizar password del usuario
export const updatePassword = (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password es requerido' });
    }

    // Encriptar nuevo password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error al encriptar password:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        usuariosModel.updatePassword(id, hashedPassword, (err, results) => {
            if (err) {
                console.error('Error al actualizar password:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            
            res.json({ message: 'Password actualizado exitosamente' });
        });
    });
};

// Eliminar usuario
export const deleteUsuario = (req, res) => {
    const { id } = req.params;

    usuariosModel.deleteUsuario(id, (err, results) => {
        if (err) {
            console.error('Error al eliminar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
};

// Obtener estadísticas de usuarios
export const getEstadisticasUsuarios = (req, res) => {
    usuariosModel.getEstadisticasUsuarios((err, results) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        res.json(results[0]);
    });
};

