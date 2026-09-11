import pool from "../config/db.js";

//obtenemos todas las ventas con el nombre del cliente
export const getAllSales = async () => {
    const result = await pool.query(`
        SELECT sales.*, customers.name AS customer_name
        FROM sales
        INNER JOIN customers ON sales.customer_id = customers.id
        `);

        return result.rows;
};

//obtenemos una venta por su id con el ombre del cliente
export const getSaleById = async (id: number) => {
    const result = await pool.query(`
        SELECT sales.*, customers.name AS customer_name
        FROM sales
        INNER JOIN customers ON sales.customer_id = customers.id
        WHERE sales.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
};

//creamos una nueva venta
export const insertSale = async (
    customer_id: number,
    total: number
) => {
    const result = await pool.query(
        "INSERT INTO sales (customer_id, total) VALUES ($1, $2) RETURNING *",
        [customer_id, total]
    );

    return result.rows[0];
};