import pool from "../config/db.js";

export async function getAllCustomers() {
  const result = await pool.query("SELECT * FROM customers ORDER BY id");
  return result.rows;
}

export async function getCustomerById(id: number) {
  const result = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function insertCustomer(name: string, email: string, phone?: string) {
  const result = await pool.query(
    "INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *",
    [name, email, phone ?? null],
  );
  return result.rows[0];
}

export async function updateCustomer(id: number, name: string, email: string, phone?: string) {
  const result = await pool.query(
    "UPDATE customers SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *",
    [name, email, phone ?? null, id],
  );
  return result.rows[0] ?? null;
}
