import { pool } from "../config/db.js";

// TIPADO DE LA TABLA
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;

}

// TIPOS PARA CREAR Y ACTUALIZAR
export type CreateProductoInput = Omit<Producto, "id">;
export type UpdateProductoInput = Partial<CreateProductoInput>;

// FUNCIONES QUE CONSULTAN A LA BASE DE DATOS
export const ProductsModel = {

  // GET
  findAll: async (): Promise<Producto[]> => {

    const { rows } = await pool.query(
      "SELECT id_prod AS id, nombre, descrip AS descripcion, precio FROM productos ORDER BY id_prod ASC;"
    );

    return rows;
  },


  // GET - Obtener por ID
  findById: async (id: number): Promise<Producto | null> => {

    const { rows } = await pool.query(
      "SELECT id_prod AS id, nombre, descrip AS descripcion, precio FROM productos WHERE id_prod = $1;",
      [id]
    );

    return rows[0] || null;
  },


  // POST
  create: async (
    dato: CreateProductoInput
  ): Promise<Producto> => {

    const {
      nombre,
      descripcion,
      precio
    } = dato;

    const query = `
      INSERT INTO productos
        (nombre, descrip, precio)
      VALUES
        ($1, $2, $3)
      RETURNING id_prod AS id, nombre, descrip AS descripcion, precio;
    `;

    const { rows } = await pool.query<Producto>(
      query,
      [nombre, descripcion, precio]
    );
    if (!rows[0]) {
      throw new Error("No se pudo crear el producto");
    }
    return rows[0];
  },


  // PUT
  update: async (
    id: number,
    dato: UpdateProductoInput
  ): Promise<Producto | null> => {

    const { rows } = await pool.query<Producto>(
      `UPDATE productos
       SET nombre = $1,
           descrip = $2,
           precio = $3
       WHERE id_prod = $4
       RETURNING id_prod AS id, nombre, descrip AS descripcion, precio;`,
      [
        dato.nombre,
        dato.descripcion,
        dato.precio,
        id
      ]
    );

    return rows[0] || null;
  },


  // DELETE
  delete: async (id: number): Promise<boolean> => {

    const { rowCount } = await pool.query(
      "DELETE FROM productos WHERE id_prod = $1;",
      [id]
    );

    return (rowCount ?? 0) > 0;
  }

};
