import pool from "../config/db.js";

export const getAllProducts = async (
  maxPrice?: number,
  page = 1,
  limit = 10
) => {
  const offset = (page - 1) * limit;

  if (maxPrice !== undefined) {
    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE price <= $1
       ORDER BY name
       LIMIT $2 OFFSET $3`,
      [maxPrice, limit, offset]
    );

    return result.rows;
  }

  const result = await pool.query(
    `SELECT *
     FROM products
     ORDER BY name
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return result.rows;
};

export const getProductById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0] ?? null;
};

export const insertProduct = async (
  name: string,
  description: string,
  price: number
) => {
  const result = await pool.query(
    `INSERT INTO products (name, description, price)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, price]
  );
  
  return result.rows[0];
};

export const updateProduct = async (
  id: number,
  name: string,
  description: string,
  price: number
) => {
  const result = await pool.query(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3
     WHERE id = $4
     RETURNING *`,
    [name, description, price, id]
  );

  return result.rows[0] ?? null;
};