import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("El correo electrónico no es válido").max(254),
  phone: z.string().trim().min(1, "El teléfono no puede estar vacío").max(30).optional(),
});

export function validateCustomer(req: Request, res: Response, next: NextFunction) {
  const result = customerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Datos inválidos", errors: result.error.issues });
  }
  req.body = result.data;
  next();
}

export function validateCustomerId(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({ message: "El ID debe ser un entero positivo válido" });
  }
  next();
}
