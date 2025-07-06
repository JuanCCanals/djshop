import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';

const router = express.Router();

// Rutas para usuarios
router.get('/usuarios', usuariosController.getAllUsuarios);
router.get('/usuarios/estadisticas', usuariosController.getEstadisticasUsuarios);
router.get('/usuarios/:id', usuariosController.getUsuarioById);
router.post('/usuarios', usuariosController.createUsuario);
router.put('/usuarios/:id', usuariosController.updateUsuario);
router.put('/usuarios/:id/password', usuariosController.updatePassword);
router.delete('/usuarios/:id', usuariosController.deleteUsuario);

export default router;

