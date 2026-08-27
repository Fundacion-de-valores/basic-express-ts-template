import type { Request, Response } from "express";
import { CustomersModel } from "../models/customerModels.js";

// GET /api/customers
export async function getCustomers(req: Request, res: Response) {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Lista a todos los clientes'
  */
  try {
    const customers = await CustomersModel.findAll();

    return res.status(200).json({
      totalClientes: customers.length,
      data: customers
    });

  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);

    return res.status(500).json({
      error: "Error al intentar conectar con la base de datos"
    });
  }
}


// GET /api/customers/:id
export async function getCustomerPorId(req: Request, res: Response) {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Obtiene un cliente por id'
    #swagger.parameters['id'] = {description: 'ID numérico del cliente'}
  */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const customer = await CustomersModel.findById(id);

    if (!customer) {
      return res.status(404).json({
        error: "Cliente no encontrado"
      });
    }

    return res.status(200).json({ data: customer });

  } catch (error: any) {
    console.error("Error al obtener cliente:", error);

    return res.status(500).json({ error: error.message });
  }
}


// POST /api/customers
export async function crearCustomer(req: Request, res: Response) {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Crea un cliente nuevo'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos para crear un cliente',
      required: true,
      schema: {
        $nombre: "Ana Torres",
        $email: "ana@correo.com",
        $telefono: "987654321"
      }
    }
  */
  try {
    // El body ya viene validado por validateCustomer
    const newCustomer = await CustomersModel.create(req.body);

    return res.status(201).json({ data: newCustomer });

  } catch (error: any) {
    console.error("Error al crear cliente:", error);

    return res.status(500).json({ error: error.message });
  }
}


// PUT /api/customers/:id
export async function actualizarCustomer(req: Request, res: Response) {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Actualiza un cliente existente'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos para actualizar un cliente',
      required: true,
      schema: {
        $nombre: "Ana Torres",
        $email: "ana@correo.com",
        $telefono: "987654321"
      }
    }
  */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const customerUpdate = await CustomersModel.update(id, req.body);

    if (!customerUpdate) {
      return res.status(404).json({
        error: "Cliente no encontrado"
      });
    }

    return res.status(200).json({ data: customerUpdate });

  } catch (error: any) {
    console.error("Error al actualizar cliente:", error);

    return res.status(500).json({ error: error.message });
  }
}
