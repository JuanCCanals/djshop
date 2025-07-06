import express from 'express';
import * as planesController from '../controllers/planesController.js';

const router = express.Router();

// Rutas para planes de suscripción
router.get('/planes', planesController.getAllPlanes);
router.get('/planes/estadisticas', planesController.getEstadisticasPlanes);
router.get('/planes/:id', planesController.getPlanById);
router.post('/planes', planesController.createPlan);
router.put('/planes/:id', planesController.updatePlan);
router.delete('/planes/:id', planesController.deletePlan);

export default router;

