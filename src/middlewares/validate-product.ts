import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  cost: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const validateProduct = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Datos del producto inválidos",
      errors: result.error.issues,
    });
    return;
  }

  next();
};