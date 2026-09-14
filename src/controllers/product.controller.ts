import type { Request, Response } from "express";
import { z } from "zod";

import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct,
} from "../models/product.model.js";

const menuQuerySchema = z.object({
  maxPrice: z.string().trim().min(1).transform(Number).pipe(z.number().nonnegative()).optional(),
  page: z.string().trim().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(2147483647)).default(1),
  limit: z.string().trim().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100)).default(10),
}).strict();

// GET /api/menu
export async function getMenu(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Obtener productos con filtro y paginación'
    #swagger.parameters['maxPrice'] = { in: 'query', type: 'number', minimum: 0, description: 'Precio máximo opcional' }
    #swagger.parameters['page'] = { in: 'query', type: 'integer', minimum: 1, default: 1 }
    #swagger.parameters['limit'] = { in: 'query', type: 'integer', minimum: 1, maximum: 100, default: 10 }
    #swagger.responses[400] = { description: 'Parámetros de consulta inválidos' }
  */

  try {
    const result = menuQuerySchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ message: "Parámetros de consulta inválidos", errors: result.error.issues });
    }
    const { maxPrice, page, limit } = result.data;
    const products = await getAllProducts(maxPrice, page, limit);

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

// GET /api/menu/:id
export async function getProduct(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Obtener producto por ID'
  */

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID debe ser un número",
      });
    }

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

// POST /api/menu
export async function createProduct(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Crear un producto'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Hamburguesa especial',
        description: 'Hamburguesa con queso',
        price: 35
      }
    }
  */

  try {
    const { name, description, price } = req.body;

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number"
    ) {
      return res.status(400).json({
        message: "Datos del producto inválidos",
      });
    }

    const product = await insertProduct(
      name,
      description,
      price
    );

    return res.status(201).json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}

// PUT /api/menu/:id
export async function updateProductController(
  req: Request,
  res: Response
) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Actualizar un producto'

    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'Hamburguesa actualizada',
        description: 'Nueva descripción',
        price: 40
      }
    }
  */

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "El ID debe ser un número",
      });
    }

    const { name, description, price } = req.body;

    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number"
    ) {
      return res.status(400).json({
        message: "Datos del producto inválidos",
      });
    }

    const product = await updateProduct(
      id,
      name,
      description,
      price
    );

    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
