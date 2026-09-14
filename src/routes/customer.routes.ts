import { Router } from "express";
import { getCustomers, getCustomer, createCustomer, updateCustomerController } from "../controllers/customer.controller.js";
import { validateCustomer, validateCustomerId } from "../middlewares/validate-customer.js";

const router: Router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", validateCustomerId, getCustomer);
router.post("/customers", validateCustomer, createCustomer);
router.put("/customers/:id", validateCustomerId, validateCustomer, updateCustomerController);

export default router;
