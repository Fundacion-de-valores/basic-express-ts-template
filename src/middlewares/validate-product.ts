import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const productSchema = z.object({
    nombre: z
        .string({ message: "nombre debe ser un texto" })
        .min(1, "nombre no puede estar vacio"),
    descripcion: z
        .string({ message: "descripcion debe ser un texto" })
        .min(1, "descripcion no puede estar vacia"),
    precio: z
        .number({ message: "precio debe ser un numero" })
        .positive("precio debe ser mayor a cero"),
});

export type ProductInput = z.infer<typeof productSchema>;

export function validateProduct(req: Request, res: Response, next: NextFunction) {
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Datos invalidos",
            errors: result.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensaje: issue.message,
            })),
        });
    }

    req.body = result.data;
    next();
}
