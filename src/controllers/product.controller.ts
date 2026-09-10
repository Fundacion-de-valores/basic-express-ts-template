import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct,
} from "../models/product.model.js";

export const getMenu = async (req: Request, res: Response) => {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener todos los productos' */

  try {
    const maxPrice =
      req.query.maxPrice !== undefined
        ? Number(req.query.maxPrice)
        : undefined;

    const page =
      req.query.page !== undefined
        ? Number(req.query.page)
        : 1;

    const limit =
      req.query.limit !== undefined
        ? Number(req.query.limit)
        : 10;

    const products = await getAllProducts(
      maxPrice,
      page,
      limit
    );

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener los productos",
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener un producto por ID' */

  try {
    const id = Number(req.params.id);

    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        message: "Producto no encontrado",
      });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el producto",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Crear un nuevo producto' */

  try {
    const { name, description, price } = req.body;

    const product = await insertProduct(
      name,
      description,
      price
    );

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear el producto",
    });
  }
};

export const updateProductController = async (
  req: Request,
  res: Response
) => {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Actualizar un producto' */

  try {
    const id = Number(req.params.id);
    const { name, description, price } = req.body;

    const product = await updateProduct(
      id,
      name,
      description,
      price
    );

    if (!product) {
      res.status(404).json({
        message: "Producto no encontrado",
      });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el producto",
    });
  }
};