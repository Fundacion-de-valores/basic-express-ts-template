import { type Request, type Response } from "express";
import { getAllSales, getSaleById, insertSale } from "../models/sale.model.js";

//obtenemos todas las ventas
export const getSales = async (req: Request, res: Response) => {
    try{
        const sales = await getAllSales();

        res.json(sales);
    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las ventas"
        });
    }
};

//obtenemos una venta por su id
export const getSale = async (req: Request, res: Response) => {
    try{
        const id = Number(req.params.id);

        const sale = await getSaleById(id);

        //404 si no existe la venta
        if (sale === null) {
            return res.status(404).json({
                error: "Venta no encontrada"
            });
        }

        res.json(sale);
    }catch(error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener la venta"
        });
    }
};

//creamos una nueva venta
export const createSale = async (req: Request, res: Response) => {
    try{
        const { customer_id, total } = req.body;

        const sale = await insertSale(customer_id, total);

        //devolvemos la venta creada
        res.status(201).json(sale);
    }catch(error){
        console.error(error);

        res.status(500).json({
            error: "Error al crear la venta"
        });
    }
};