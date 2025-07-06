import express from 'express';
import { body } from 'express-validator';
import { 
  getPlanes, 
  getPlanById, 
  createPlan, 
  updatePlan, 
  deletePlan, 
  suscribirUsuario, 
  verificarSuscripcion,
  actualizarTokens,
  asignarTokensManual
} from '../controllers/planes/planesController.js';

const router = express.Router();

// Rutas para gestión de planes
router.get('/', getPlanes);
router.get('/:id', getPlanById);
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('tokens_asignados').isInt({ min: 1 }).withMessage('Los tokens asignados deben ser un número entero positivo')
], createPlan);
router.put('/:id', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('tokens_asignados').isInt({ min: 1 }).withMessage('Los tokens asignados deben ser un número entero positivo')
], updatePlan);
router.delete('/:id', deletePlan);

// Rutas para suscripciones y tokens
router.post('/suscribir', [
  body('usuario_id').isInt().withMessage('ID de usuario inválido'),
  body('plan_id').isInt().withMessage('ID de plan inválido'),
  body('metodo_pago').notEmpty().withMessage('El método de pago es requerido')
], suscribirUsuario);
router.get('/verificar/:usuario_id', verificarSuscripcion);
router.put('/tokens/:usuario_id', [
  body('tokens_gastados').isInt({ min: 1 }).withMessage('Los tokens gastados deben ser un número entero positivo')
], actualizarTokens);

// Ruta para asignación manual de tokens por parte del administrador
router.post('/asignar-tokens', [
  body('usuario_id').isInt().withMessage('ID de usuario inválido'),
  body('tokens').isInt({ min: 1 }).withMessage('La cantidad de tokens debe ser un número entero positivo'),
  body('admin_id').isInt().withMessage('ID de administrador inválido')
], asignarTokensManual);

export default router;
