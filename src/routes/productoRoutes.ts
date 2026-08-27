import { Router } from "express";
import {
    getProducts,
    getProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto } from "../controllers/productoController.js";
import { validateProduct } from "../middlewares/validate-product.js";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProductoPorId);
router.post("/", validateProduct, crearProducto);
router.put("/:id", validateProduct, actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;
