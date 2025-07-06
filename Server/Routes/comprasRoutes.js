import express from 'express';
import * as comprasController from '../controllers/comprasController.js';

const router = express.Router();

// Rutas para compras/descargas
router.get('/compras', comprasController.getAllCompras);
router.get('/compras/estadisticas', comprasController.getEstadisticasCompras);
router.get('/compras/fecha', comprasController.getComprasByFecha);
router.get('/compras/usuario/:usuarioId', comprasController.getComprasByUsuario);
router.get('/compras/:id', comprasController.getCompraById);
router.post('/compras', comprasController.createCompra);
router.delete('/compras/:id', comprasController.deleteCompra);

export default router;

