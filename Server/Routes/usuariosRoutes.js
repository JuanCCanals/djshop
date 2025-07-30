import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';

const router = express.Router();

// Rutas para usuarios
router.get('/', usuariosController.getAllUsuarios);
router.get('/estadisticas', usuariosController.getEstadisticasUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.put('/:id/password', usuariosController.updatePassword);
router.delete('/:id', usuariosController.deleteUsuario);

export default router;

