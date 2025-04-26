import express from 'express';
import { body } from 'express-validator';
import { getDescargas, createDescarga } from '../controllers/descargasController.js';

const router = express.Router();

router.get('/', getDescargas);

router.post(
  '/',
  [
    body('usuario_id').isInt().withMessage('usuario_id debe ser un número'),
    body('producto_id').isInt().withMessage('producto_id debe ser un número'),
    body('tokens_gastados').isInt({ min: 1 }),
  ],
  createDescarga
);

export default router;
