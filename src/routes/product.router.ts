import { Router } from 'express';
import * as ProductController from '../controllers/product.controller.js';

const router = Router();

// Mapeamento das rotas para as funções do controller
router.get('/menu', ProductController.getMenu);
router.get('/menu/:id', ProductController.getProduct);
router.post('/menu', ProductController.createProduct);
router.put('/menu/:id', ProductController.updateProduct);

export default router;