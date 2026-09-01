import { Router } from "express";
import { getMenu, getProduct, createProduct, updateProductController } from "../controllers/product.controller.js"; //importamos el controlador
import { validateProduct } from "../middlewares/validate-product.js";

const router = Router();

router.get("/menu", getMenu); //ruta para obtener todos los productos
router.get("/menu/:id", getProduct);
router.post("/menu", validateProduct, createProduct);
router.put("/menu/:id", updateProductController);


export default router; //exportamos las rutas