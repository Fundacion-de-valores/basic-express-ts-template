import { Router } from "express";
import {
    getCustomers,
    getCustomerPorId,
    crearCustomer,
    actualizarCustomer } from "../controllers/customerController.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const router = Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerPorId);
router.post("/", validateCustomer, crearCustomer);
router.put("/:id", validateCustomer, actualizarCustomer);

export default router;
