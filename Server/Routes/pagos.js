import express from 'express';
import { body } from 'express-validator';
import { getPagos, createPago } from '../controllers/pagosController.js';

const router = express.Router();

router.get('/', getPagos);

router.post(
  '/',
  [
    body('usuario_id').isInt(),
    body('monto').isFloat({ min: 0.1 }),
    body('metodo_pago').notEmpty(),
  ],
  createPago
);

export default router;
