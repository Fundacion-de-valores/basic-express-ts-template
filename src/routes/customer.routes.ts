import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomerController,
} from "../controllers/customer.controller.js";
import { validateCustomer } from "../middlewares/validate-customer.js";

const router: Router = Router();

router.get("/customers", getCustomers);

router.get("/customers/:id", getCustomer);

router.post("/customers", validateCustomer, createCustomer);

router.put("/customers/:id", updateCustomerController);

export default router;