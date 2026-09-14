import type { Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer,
} from "../models/customer.model.js";

export async function getCustomers(req: Request, res: Response) {
  /*
    #swagger.tags = ['Customers']
    #swagger.summary = 'Obtener todos los clientes'
  */
  try {
    return res.status(200).json(await getAllCustomers());
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getCustomer(req: Request, res: Response) {
  /*
    #swagger.tags = ['Customers']
    #swagger.summary = 'Obtener un cliente por ID'
    #swagger.responses[400] = { description: 'ID inválido' }
    #swagger.responses[404] = { description: 'Cliente no encontrado' }
  */
  try {
    const customer = await getCustomerById(Number(req.params.id));
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
    return res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function createCustomer(req: Request, res: Response) {
  /*
    #swagger.tags = ['Customers']
    #swagger.summary = 'Crear un cliente'
    #swagger.parameters['body'] = {
      in: 'body', required: true,
      schema: { name: 'Ana López', email: 'ana@example.com', phone: '55551234' }
    }
    #swagger.responses[201] = { description: 'Cliente creado' }
    #swagger.responses[400] = { description: 'Datos inválidos' }
  */
  try {
    const { name, email, phone } = req.body;
    return res.status(201).json(await insertCustomer(name, email, phone));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function updateCustomerController(req: Request, res: Response) {
  /*
    #swagger.tags = ['Customers']
    #swagger.summary = 'Actualizar un cliente; omitir phone lo elimina'
    #swagger.parameters['body'] = {
      in: 'body', required: true,
      schema: { name: 'Ana López', email: 'ana@example.com', phone: '55554321' }
    }
    #swagger.responses[400] = { description: 'ID o datos inválidos' }
    #swagger.responses[404] = { description: 'Cliente no encontrado' }
  */
  try {
    const { name, email, phone } = req.body;
    const customer = await updateCustomer(Number(req.params.id), name, email, phone);
    if (!customer) return res.status(404).json({ message: "Cliente no encontrado" });
    return res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
