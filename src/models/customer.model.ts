import pool from "../config/db.js"; //importamos el pool de conexión a PostgreSQL

//función para obtener todos los clientes
export const getAllCustomers = async () => {
    const result = await pool.query(
        "SELECT * FROM customers"
    );
    return result.rows; // retornamos todos los clientes
};


//función para obtener un cliente por su id
export const getCustomerById = async (id: number) => {
    const result = await pool.query(
        "SELECT * FROM customers WHERE id = $1", [id]
    );

    if (result.rows.length === 0) {
        return null; // retornamos null si no existe
    } 
    return result.rows[0]; // retornamos el cliente encontrado
};


//función para crear un nunevo cliente
export const insertCustomer = async (
    name: string,
    email: string,
    phone_number: string 
) =>{
        const result = await pool.query(
            "INSERT INTO customers (name, email, phone_number) VALUES ($1, $2, $3) RETURNING *",
            [name, email, phone_number]
        );
        return result.rows[0]; // retornamos el cliente nuevo
    };


//función para actualizar un cliente
export const updateCustomer = async (
    id: number,
    name: string,
    email: string,
    phone_number: string
) => {
    const result = await pool.query(
        "UPDATE customers SET name = $1, email = $2, phone_number = $3 WHERE id = $4 RETURNING *",
        [name, email, phone_number, id]
    );

    if (result.rows.length === 0) {
        return null; // restornamos null si no existe
    }

    return result.rows[0]; // retornamos el cliente actualizado
};    