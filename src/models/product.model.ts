import pool from "../config/db.js";

// GET /api/menu
export async function getAllProducts() {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
}

// GET /api/menu/:id
export async function getProductById(id: string) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

// POST /api/menu
export async function insertProduct(name: string, description: string, price: number) {
  const result = await pool.query(
    'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
    [name, description, price]
  );
  return result.rows[0];
}

// PUT /api/menu/:id
export async function updateProduct(id: string, name: string, description: string, price: number) {
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
    [name, description, price, id]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}