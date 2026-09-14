import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { totalInCents } from "../models/sale.model.js";

const idSchema = z.number().int().positive().max(2147483647);
const money = z.number().nonnegative().max(9999999999.99)
  .refine(value => Number(value.toFixed(2)) === value, "Usa como máximo dos decimales");
const itemSchema = z.object({
  product_id: idSchema,
  quantity: z.number().int().positive().max(10000),
  unit_price: money.max(999999.99),
}).strict();

const saleSchema = z.union([
  z.object({ customer_id: idSchema, total: money }).strict(),
  z.object({
    customer_id: idSchema,
    items: z.array(itemSchema).min(1).max(100),
  }).strict().refine(value => totalInCents(value.items) <= 999999999999, "El total supera el máximo permitido"),
]);

export function validateSale(req: Request, res: Response, next: NextFunction) {
  const result = saleSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Datos de venta inválidos", errors: result.error.issues });
  }
  req.body = result.data;
  next();
}

export function validateSaleId(req: Request, res: Response, next: NextFunction) {
  const result = idSchema.safeParse(Number(req.params.id));
  if (!result.success) {
    return res.status(400).json({ message: "El ID debe ser un entero positivo válido" });
  }
  next();
}
