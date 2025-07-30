import express from 'express';
import * as pistasController from '../controllers/pistasController.js';

const router = express.Router();

// Rutas para pistas/productos
router.get('/', pistasController.getAllPistas);
router.get('/destacadas', pistasController.getPistasDestacadas);
router.get('/tipo/:tipo', pistasController.getPistasByTipo);
router.get('/genero/:generoId', pistasController.getPistasByGenero);
router.get('/search', pistasController.searchPistas);
router.get('/:id', pistasController.getPistaById);
router.post('/', pistasController.createPista);
router.put('/:id', pistasController.updatePista);
router.delete('/:id', pistasController.deletePista);

export default router;