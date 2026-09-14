import pool from "../config/db.js";

// GET - Obtener todos los productos
export async function getAllProducts(maxPrice?: number, page = 1, limit = 10) {
  const values: number[] = [];
  let query = "SELECT * FROM products";
  if (maxPrice !== undefined) {
    values.push(maxPrice);
    query += " WHERE precio <= $1";
  }
  values.push(limit, (page - 1) * limit);
  // Solo los números de los marcadores se construyen aquí; los datos van en values.
  query += ` ORDER BY id LIMIT $${values.length - 1} OFFSET $${values.length}`;
  const result = await pool.query(query, values);

  return result.rows;
}

// GET - Obtener un producto por ID
export async function getProductById(id: number) {
  const result = await pool.query(
    "SELECT * FROM products WHERE id = $1",
    [id]
  );

  return result.rows[0] ?? null;
}

// POST - Crear un producto
export async function insertProduct(
  name: string,
  description: string,
  price: number
) {
  const result = await pool.query(
    `
      INSERT INTO products (nombre, descripcion, precio)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [name, description, price]
  );

  return result.rows[0];
}

// PUT - Actualizar un producto
export async function updateProduct(
  id: number,
  name: string,
  description: string,
  price: number
) {
  const result = await pool.query(
    `
      UPDATE products
      SET nombre = $1,
          descripcion = $2,
          precio = $3
      WHERE id = $4
      RETURNING *
    `,
    [name, description, price, id]
  );

  return result.rows[0] ?? null;
}
