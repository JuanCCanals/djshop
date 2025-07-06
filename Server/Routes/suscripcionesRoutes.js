import express from 'express';
import * as suscripcionesController from '../controllers/suscripcionesController.js';

const router = express.Router();

// Rutas para suscripciones
router.get('/suscripciones', suscripcionesController.getAllSuscripciones);
router.get('/suscripciones/estadisticas', suscripcionesController.getEstadisticasSuscripciones);
router.get('/suscripciones/usuario/:usuarioId', suscripcionesController.getSuscripcionesByUsuario);
router.get('/suscripciones/activa/:usuarioId', suscripcionesController.getSuscripcionActivaByUsuario);
router.get('/suscripciones/:id', suscripcionesController.getSuscripcionById);
router.post('/suscripciones', suscripcionesController.createSuscripcion);
router.put('/suscripciones/:id', suscripcionesController.updateSuscripcion);
router.put('/suscripciones/:id/tokens', suscripcionesController.updateTokensRestantes);
router.post('/suscripciones/descontar-tokens/:usuarioId', suscripcionesController.descontarTokens);
router.put('/suscripciones/:id/cancelar', suscripcionesController.cancelarSuscripcion);
router.post('/suscripciones/expirar-vencidas', suscripcionesController.expirarSuscripcionesVencidas);

export default router;

