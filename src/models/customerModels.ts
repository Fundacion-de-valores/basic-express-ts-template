import { pool } from "../config/db.js";

// TIPADO DE LA TABLA
export interface Customer {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

// TIPOS PARA CREAR Y ACTUALIZAR
export type CreateCustomerInput = Omit<Customer, "id">;
export type UpdateCustomerInput = CreateCustomerInput;

// Mapeo de columnas reales de la tabla -> nombres que expone la API
const COLUMNS = "id_cliente AS id, nombre, email, telefono";

export const CustomersModel = {

  // GET - Todos los clientes
  findAll: async (): Promise<Customer[]> => {

    const { rows } = await pool.query<Customer>(
      `SELECT ${COLUMNS} FROM clientes ORDER BY id_cliente ASC;`
    );

    return rows;
  },


  // GET - Obtener por ID
  findById: async (id: number): Promise<Customer | null> => {

    const { rows } = await pool.query<Customer>(
      `SELECT ${COLUMNS} FROM clientes WHERE id_cliente = $1;`,
      [id]
    );

    return rows[0] ?? null;
  },


  // POST
  create: async (dato: CreateCustomerInput): Promise<Customer> => {

    const { nombre, email, telefono } = dato;

    const { rows } = await pool.query<Customer>(
      `INSERT INTO clientes
         (nombre, email, telefono)
       VALUES
         ($1, $2, $3)
       RETURNING ${COLUMNS};`,
      [nombre, email, telefono]
    );

    if (!rows[0]) {
      throw new Error("No se pudo crear el cliente");
    }
    return rows[0];
  },


  // PUT
  update: async (
    id: number,
    dato: UpdateCustomerInput
  ): Promise<Customer | null> => {

    const { nombre, email, telefono } = dato;

    const { rows } = await pool.query<Customer>(
      `UPDATE clientes
          SET nombre = $1,
              email = $2,
              telefono = $3
        WHERE id_cliente = $4
      RETURNING ${COLUMNS};`,
      [nombre, email, telefono, id]
    );

    return rows[0] ?? null;
  },

};
