import type { Request, Response } from "express";
import { getAllSales, getSaleById, insertSale } from "../models/sale.model.js";

export async function getSales(req: Request, res: Response) {
  /*
    #swagger.tags = ['Sales']
    #swagger.summary = 'Obtener ventas con el nombre del cliente'
  */
  try {
    return res.status(200).json(await getAllSales());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getSale(req: Request, res: Response) {
  /*
    #swagger.tags = ['Sales']
    #swagger.summary = 'Obtener una venta por ID con nombre del cliente'
    #swagger.responses[400] = { description: 'ID inválido' }
    #swagger.responses[404] = { description: 'Venta no encontrada' }
  */
  try {
    const sale = await getSaleById(Number(req.params.id));
    if (!sale) return res.status(404).json({ message: "Venta no encontrada" });
    return res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function createSale(req: Request, res: Response) {
  /*
    #swagger.tags = ['Sales']
    #swagger.summary = 'Crear venta simple o venta con detalles en una transacción'
    #swagger.description = 'Enviar customer_id y total, o customer_id e items. Con items, el total se calcula a partir de quantity y unit_price. No enviar total junto con items. Usar IDs existentes.'
    #swagger.parameters['body'] = {
      in: 'body', required: true,
      schema: { customer_id: 1, items: [{ product_id: 2, quantity: 3, unit_price: 45 }] }
    }
    #swagger.responses[201] = { description: 'Venta creada; incluye items en la versión extendida' }
    #swagger.responses[400] = { description: 'Datos inválidos' }
    #swagger.responses[500] = { description: 'Error de base de datos; la transacción se revierte' }
  */
  try {
    return res.status(201).json(await insertSale(req.body));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "No se pudo crear la venta" });
  }
}
