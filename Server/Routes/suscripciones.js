import express from 'express';
import { body } from 'express-validator';
import { getSuscripciones, createSuscripcion } from '../controllers/suscripcionesController.js';

const router = express.Router();

router.get('/', getSuscripciones);

router.post(
  '/',
  [
    body('usuario_id').isInt(),
    body('plan').notEmpty(),
  ],
  createSuscripcion
);

export default router;
