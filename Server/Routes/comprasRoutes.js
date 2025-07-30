import express from 'express';
import * as comprasController from '../controllers/comprasController.js';

const router = express.Router();

// Rutas para compras/descargas
router.get('/', comprasController.getAllCompras);
router.get('/estadisticas', comprasController.getEstadisticasCompras);
router.get('/fecha', comprasController.getComprasByFecha);
router.get('/usuario/:usuarioId', comprasController.getComprasByUsuario);
router.get('/:id', comprasController.getCompraById);
router.post('/', comprasController.createCompra);
router.delete('/:id', comprasController.deleteCompra);

export default router;

