import type { Request, Response } from "express";
import {
  getAllCustomers,
  getCustomerById,
  insertCustomer,
  updateCustomer,
} from "../models/customer.model.js";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener los clientes",
    });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const customer = await getCustomerById(id);

    if (!customer) {
      res.status(404).json({
        message: "Cliente no encontrado",
      });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el cliente",
    });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone_number } = req.body;

    const customer = await insertCustomer(
      name,
      email,
      phone_number
    );

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear el cliente",
    });
  }
};

export const updateCustomerController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone_number } = req.body;

    const customer = await updateCustomer(
      id,
      name,
      email,
      phone_number
    );

    if (!customer) {
      res.status(404).json({
        message: "Cliente no encontrado",
      });
      return;
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el cliente",
    });
  }
};