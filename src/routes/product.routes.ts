import { Router } from "express";

import {
  getMenu,
  getProduct,
  createProduct,
  updateProductController,
} from "../controllers/product.controller.js";

import { validateProduct } from "../middlewares/validate-product.js";

const router: Router = Router();

// GET - Obtener todos los productos
router.get("/menu", getMenu);

// GET - Obtener un producto por ID
router.get("/menu/:id", getProduct);

// POST - Crear un producto
router.post("/menu", validateProduct, createProduct);

// PUT - Actualizar un producto
router.put("/menu/:id", updateProductController);

export default router;