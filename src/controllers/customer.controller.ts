import { type Request, type Response } from "express";
import { getAllCustomers, getCustomerById, insertCustomer, updateCustomer } from "../models/customer.model.js";

//funcion para obtener todos los clientes desde la bd
export const getCustomers = async (req: Request, res: Response) => {
    try {         //si hay un error, seguimos con catch
        const customers = await getAllCustomers();

        res.json(customers);     //enviamos los clientes como respuesta   
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los clientes"
        });
    }
};


//funcion para obtener un cliente por su id
export const getCustomer = async ( req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const customer = await getCustomerById(id); //buscamos el id cliente en la bd

        if (customer === null) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(customer);
    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener el cliente"
        });
    }
};


//función para crear un cliente nuevo
export const createCustomer = async (req: Request, res: Response) => {
    try {
        const { name, email, phone_number } = req.body; //obtenemos los datos del cliente enviados en el body

        const customer = await insertCustomer( //insertamos el nuevo cliente en la bd
            name, 
            email, 
            phone_number
        );

        res.status(201).json(customer);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al crear el cliente"
        });
    }
};


//función para actualizar un cliente
export const updateCustomerController = async (req: Request, res: Response) => {
    try{
        const id = Number(req.params.id);
        const { name, email, phone_number } = req.body;
        const customer = await updateCustomer(
            id,
            name,
            email,
            phone_number
        );

        if (customer === null) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json(customer); //enviamos el cliente actualizado
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al actualizar el cliente"
        });
    }
};