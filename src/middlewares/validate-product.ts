import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),

  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria"),

  price: z
    .number()
    .positive("El precio debe ser mayor a 0"),

  cost: z
    .number()
    .min(0, "El costo debe ser mayor o igual a 0")
    .optional(),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock debe ser mayor o igual a 0")
    .optional(),
});

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.issues,
    });
  }

  req.body = result.data;

  next();
}