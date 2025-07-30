import express from 'express';
import * as planesController from '../controllers/planesController.js';

const router = express.Router();

// Rutas para planes de suscripción
router.get('/', planesController.getAllPlanes);
router.get('/estadisticas', planesController.getEstadisticasPlanes);
router.get('/:id', planesController.getPlanById);
router.post('/', planesController.createPlan);
router.put('/:id', planesController.updatePlan);
router.delete('/:id', planesController.deletePlan);

export default router;

