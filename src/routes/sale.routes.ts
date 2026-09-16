import { Router } from "express";
import { getSales, getSale, createSale } from "../controllers/sale.controller.js";

const router = Router();

router.get("/sales", getSales); //ruta para obtener todas las ventas
router.get("/sales/:id", getSale); //ruta para obtener una venta por su id
router.post("/sales", createSale); //ruta para crear una venta

export default router;
