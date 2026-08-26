import { type Request, type Response } from "express";
import { getAllProducts, getProductById, insertProduct, updateProduct } from "../models/product.model.js"; //importamos las funciones del modelo

//Función para obtener todos los productos
export const getMenu = async (req: Request, res: Response) => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener todos los productos'*/

    try{
        const products = await getAllProducts(); //llamamos al modelo para obtener los productos

        res.json(products); //enviamos los productos como respuesta en formato JSON
    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
};


//función para obtener un producto por su id
export const getProduct = async (req: Request, res: Response) => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener un producto por su id'*/

    try{
        const id = Number(req.params.id); //obtenemos el id desde la url
        const product = await getProductById(id); //buscamos el producto en el modelo

        if (product === null) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(product); //enviamos el producto encontrado
    }catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener el producto"
        });
    }
};


//función para crear un nuevo producto
export const createProduct = async (req: Request, res:Response) => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Crear un nuevo producto'*/

    try{
        const { name, price } = req.body; //obtenemos los datos enviados en el body
        const product = await insertProduct(name, price); //creamos el producto en el modelo

        res.status(201).json(product); //respondemos con el producto creado
    }catch (error){
        console.error(error);

        res.status(500).json({
            error: "Error al crear el producto"
        });
    }
};


//funcion para actualizar un producto
export const updateProductController = async (req: Request, res: Response) =>{
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Actualizar un producto'*/

    try{
        const id = Number(req.params.id); //obtenemos el id desde la url
        const { name, price } = req.body; //obtenemos los nuevos datos

        const product = await  updateProduct(id, name, price); //actualizamos el producto en el modelo

        if (product === null) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(product); //enviamos el producto actualizado
    } catch(error) {
        console.error(error);

        res.status(500).json({
            error: "Error al actualizar el producto"
        });
    }
};