import express from 'express';
import * as suscripcionesController from '../controllers/suscripcionesController.js';

const router = express.Router();

// Rutas para suscripciones
router.get('/', suscripcionesController.getAllSuscripciones);
router.get('/estadisticas', suscripcionesController.getEstadisticasSuscripciones);
router.get('/usuario/:usuarioId', suscripcionesController.getSuscripcionesByUsuario);
router.get('/activa/:usuarioId', suscripcionesController.getSuscripcionActivaByUsuario);
router.get('/:id', suscripcionesController.getSuscripcionById);
router.post('/', suscripcionesController.createSuscripcion);
router.put('/:id', suscripcionesController.updateSuscripcion);
router.put('/:id/tokens', suscripcionesController.updateTokensRestantes);
router.post('/descontar-tokens/:usuarioId', suscripcionesController.descontarTokens);
router.put('/:id/cancelar', suscripcionesController.cancelarSuscripcion);
router.post('/expirar-vencidas', suscripcionesController.expirarSuscripcionesVencidas);

export default router;

