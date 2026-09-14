import { Router } from "express";
import { getSales, getSale, createSale } from "../controllers/sale.controller.js";
import { validateSale, validateSaleId } from "../middlewares/validate-sale.js";

const router: Router = Router();
router.get("/sales", getSales);
router.get("/sales/:id", validateSaleId, getSale);
router.post("/sales", validateSale, createSale);
export default router;
