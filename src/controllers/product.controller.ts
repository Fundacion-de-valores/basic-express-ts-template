import type { Request, Response } from "express";
import { getAllProducts } from "../models/product.model.js";
import * as ProductModel from '../models/product.model.js';

// GET /api/menu
export async function getMenu(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Retorna todos os produtos do menu' */
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// GET /api/menu/:id
export async function getProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Retorna un producto por su id' */
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
  return res.status(400).json({ error: 'ID inválido ou não fornecido' });
}
    const product = await ProductModel.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// POST /api/menu
export async function createProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Crea un nuevo producto' */
  try {
    const { name, description, price } = req.body;
    const newProduct = await ProductModel.insertProduct(name, description, price);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// PUT /api/menu/:id
export async function updateProduct(req: Request, res: Response) {
  /*#swagger.tags = ['Products']
    #swagger.summary = 'Actualiza un producto existente' */
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
  return res.status(400).json({ error: 'ID inválido ou não fornecido' });
}
    const { name, description, price } = req.body;
    const updatedProduct = await ProductModel.updateProduct(id, name, description, price);
    
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}