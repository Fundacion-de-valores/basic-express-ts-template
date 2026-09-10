import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone_number: z.string().min(1),
});

export const validateCustomer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = customerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Datos del cliente inválidos",
      errors: result.error.issues,
    });
    return;
  }

  next();
};