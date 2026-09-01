import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

//schema que define como debe ser un producto
const productSchema = z.object({
    name: z.string().min(1, "El nombre no puede estar vacío"),
    description: z.string().min(1, "La descripcion no debe estar vacía"),
    price: z.number().positive("El precio debe ser mayor a cero"),
});

//middleware para validar los datos del producto
export const validateProduct = (
    req: Request,
    res: Response,
    next: NextFunction) => {
        const result = productSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Datos inválidos",
                details: result.error.issues,
            });
        }

        next();
    };