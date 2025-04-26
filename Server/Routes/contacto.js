import express from 'express';
import { body } from 'express-validator';
import { enviarMensajeContacto } from '../controllers/contactoController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('mensaje').notEmpty().withMessage('El mensaje no puede estar vacío'),
  ],
  enviarMensajeContacto
);

export default router;
