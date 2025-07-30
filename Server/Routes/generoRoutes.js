import express from 'express';
import { obtenerGeneros, agregarGenero, actualizarGenero, eliminarGenero } from '../controllers/generoController.js';

const router = express.Router();

router.get('/', obtenerGeneros);
router.post('/', agregarGenero);
router.put('/:id', actualizarGenero);
router.delete('/:id', eliminarGenero);

export default router;
