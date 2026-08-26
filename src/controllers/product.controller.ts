import type { Request, Response } from "express";

import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct,
} from "../models/product.model.js";

// GET /api/menu
export async function getMenu(req: Request, res: Response) {
  /*
    #swagger.tags = ['Products']
    #swagger.summary = 'Obtener todos los productos'
  */

  try {
    const products = await getAllProducts();

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