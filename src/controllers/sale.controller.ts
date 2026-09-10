import type { Request, Response } from "express";
import {
  getAllSales,
  getSaleById,
  insertSale,
} from "../models/sale.model.js";

export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await getAllSales();

    res.json(sales);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las ventas",
    });
  }
};

export const getSale = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const sale = await getSaleById(id);

    if (!sale) {
      res.status(404).json({
        message: "Venta no encontrada",
      });
      return;
    }

    res.json(sale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener la venta",
    });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.body;

    const sale = await insertSale(customer_id);

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear la venta",
    });
  }
};