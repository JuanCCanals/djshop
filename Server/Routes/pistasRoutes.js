import express from 'express';
import * as pistasController from '../controllers/pistasController.js';

const router = express.Router();

// Rutas para pistas/productos
router.get('/pistas', pistasController.getAllPistas);
router.get('/pistas/destacadas', pistasController.getPistasDestacadas);
router.get('/pistas/tipo/:tipo', pistasController.getPistasByTipo);
router.get('/pistas/genero/:generoId', pistasController.getPistasByGenero);
router.get('/pistas/search', pistasController.searchPistas);
router.get('/pistas/:id', pistasController.getPistaById);
router.post('/pistas', pistasController.createPista);
router.put('/pistas/:id', pistasController.updatePista);
router.delete('/pistas/:id', pistasController.deletePista);

export default router;