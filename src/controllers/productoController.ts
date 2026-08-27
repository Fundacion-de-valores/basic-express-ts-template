import type { Request, Response } from "express";
import { ProductsModel } from "../models/productoModels.js";

// GET /productos
// Obtener todos los productos
export async function getProducts(
  req: Request,
  res: Response
) {
    /*
      #swagger.tags = ['Producto']
      #swagger.summary = 'Lista a todos los productos'
    */
  try {
    const products = await ProductsModel.findAll();

    return res.status(200).json({
      totalProductos: products.length,
      data: products
    });

  } catch (error: any) {
    console.error("Error al consultar PostgreSQL:", error);

    return res.status(500).json({
      error: "Error al intentar conectar con la base de datos"
    });
  }
}


// GET /productos/:id
// Obtener un producto por ID
export async function getProductoPorId(
  req: Request,
  res: Response
) {
    /*
      #swagger.tags = ['Producto']
      #swagger.summary = 'Lista para listar a un producto'
       #swagger.parameters['id'] = {description: 'Id del producto'}
    */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const product = await ProductsModel.findById(id);

    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      data: product
    });

  } catch (error: any) {
    console.error("Error al obtener producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}


// POST /productos
// Crear un nuevo producto
export async function crearProducto(
  req: Request,
  res: Response
) {
   /*
      #swagger.tags = ['Producto']
      #swagger.summary = 'crear un producto nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para crear un producto nuevo',
        required: true,
        schema: {
          $nombre: "coca cola",
          $descripcion: "bebida",
          $precio: 15
        }
    */
  try {
    const {
      nombre,
      descripcion,
      precio
    } = req.body;

    // Validar datos obligatorios
    if (
      !nombre ||
      !descripcion ||
      precio === undefined
    ) {
      return res.status(400).json({
        error: "Nombre, descripcion y precio son obligatorios"
      });
    }

    // Validar precio
    if (typeof precio !== "number" || precio <= 0) {
      return res.status(400).json({
        error: "El precio debe ser un número mayor a 0"
      });
    }

    const newProduct = await ProductsModel.create({
      nombre,
      descripcion,
      precio
    });

    return res.status(201).json({
      data: newProduct
    });

  } catch (error: any) {
    console.error("Error al crear producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}


// PUT /productos/:id
// Modificar un producto
export async function actualizarProducto(
  req: Request,
  res: Response
) {
    /*
      #swagger.tags = ['Producto']
      #swagger.summary = 'Actualizar un producto nuevo'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para actualizar un producto',
        required: true,
        schema: {
          $nombre: "coca cola",
          $descripcion: "bebida",
          $precio: 15
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

    const productoUpdate = await ProductsModel.update(
      id,
      req.body
    );

    if (!productoUpdate) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      data: productoUpdate
    });

  } catch (error: any) {
    console.error("Error al actualizar producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}


// DELETE /productos/:id
// Eliminar un producto
export async function eliminarProducto(
  req: Request,
  res: Response
) {
     /*
    #swagger.tags = ['Producto']
    #swagger.description = 'Elimina a un producto'
    #swagger.parameters['id'] = {description: 'ID numérico del producto'}
  */
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "El ID debe ser un valor numérico"
      });
    }

    const productoEliminado = await ProductsModel.delete(id);

    if (!productoEliminado) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    return res.status(200).json({
      message: "Producto eliminado exitosamente"
    });

  } catch (error: any) {
    console.error("Error al eliminar producto:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
