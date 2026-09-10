import { validateProduct } from "../middlewares/validate-product.js";
import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProductController,
} from "../controllers/product.controller.js";

const router: Router = Router();

router.get("/menu", getMenu);

router.get("/menu/:id", getProduct);

router.post("/menu", validateProduct, createProduct);

router.put("/menu/:id", updateProductController);

export default router;