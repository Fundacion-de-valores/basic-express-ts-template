import { Router } from "express";
import { getCustomers, getCustomer, createCustomer, updateCustomerController} from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const router = Router();

//ruta para obtener todos los clientes
router.get("/customers", getCustomers);

//ruta par obtener un cliente por su id
router.get("/customers/:id", getCustomer);

//ruta para crear un cliente
router.post("/customers", validateCustomer, createCustomer);

//ruta para actualizar un cliente
router.put("/customers/:id", updateCustomerController);

export default router;