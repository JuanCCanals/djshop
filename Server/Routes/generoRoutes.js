import express from 'express';
import { obtenerGeneros, agregarGenero, actualizarGenero, eliminarGenero } from '../controllers/generoController.js';

const router = express.Router();

router.get('/generos', obtenerGeneros);
router.post('/generos', agregarGenero);
router.put('/generos/:id', actualizarGenero);
router.delete('/generos/:id', eliminarGenero);

export default router;
