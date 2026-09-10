import pool from "../config/db.js";

export const getAllSales = async () => {
  const result = await pool.query(
    `SELECT
       sales.id,
       sales.date,
       sales.customer_id,
       sales.status,
       custumers.name AS customer_name
     FROM sales
     INNER JOIN custumers
       ON sales.customer_id = custumers.id
     ORDER BY sales.id`
  );

  return result.rows;
};

export const getSaleById = async (id: number) => {
  const result = await pool.query(
    `SELECT
       sales.id,
       sales.date,
       sales.customer_id,
       sales.status,
       custumers.name AS customer_name
     FROM sales
     INNER JOIN custumers
       ON sales.customer_id = custumers.id
     WHERE sales.id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
};


export const insertSale = async (customer_id: number) => {
  const result = await pool.query(
    `INSERT INTO sales (customer_id)
     VALUES ($1)
     RETURNING *`,
    [customer_id]
  );

  return result.rows[0];
};