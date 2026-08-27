import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

// Schema que describe la forma correcta del body de un cliente
export const customerSchema = z.object({
    nombre: z
        .string({ message: "nombre debe ser un texto" })
        .min(1, "nombre no puede estar vacio"),
    email: z
        .string({ message: "email debe ser un texto" })
        .email("email debe tener un formato valido"),
    telefono: z
        .string({ message: "telefono debe ser un texto" })
        .min(6, "telefono debe tener al menos 6 caracteres"),
});

export type CustomerInput = z.infer<typeof customerSchema>;

export function validateCustomer(req: Request, res: Response, next: NextFunction) {
    const result = customerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Datos invalidos",
            detalles: result.error.issues.map((issue) => ({
                campo: issue.path.join("."),
                mensaje: issue.message,
            })),
        });
    }

    req.body = result.data;
    next();
}
