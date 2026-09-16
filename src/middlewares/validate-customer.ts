import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

//definimos como debe ser un cliente con schema, le decimos a zod qué datos debe tener
const customerSchema = z.object({
    name: z.string().min(1, "El nombre no debe estar vacío"),
    email: z.string().email("El mail no es válido"),
    phone_number: z.string().min(1, "El teléfono no debe estar vacío"),
});

//middleware para validar los datos del cliente
export const validateCustomer = (
    req: Request,
    res: Response, next: NextFunction
) => {
    const result = customerSchema.safeParse(req.body); //validamos los datos recibidos usando el schema zod

    if(!result.success) {
        return res.status(400).json({
            error: "Datos inválidos",
            details: result.error.issues,
        });
    }

    next(); //si los datos son válidos, seguimos con la ste función
};