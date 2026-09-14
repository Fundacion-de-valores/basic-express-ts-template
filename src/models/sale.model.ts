import pool from "../config/db.js";

export interface SaleItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export type SaleInput = { customer_id: number; total: number } | { customer_id: number; items: SaleItem[] };

export function totalInCents(items: SaleItem[]) {
  return items.reduce((total, item) => total + Math.round(item.unit_price * 100) * item.quantity, 0);
}

export async function getAllSales() {
  const result = await pool.query(
    `SELECT sales.*, customers.name AS customer_name
     FROM sales INNER JOIN customers ON customers.id = sales.customer_id
     ORDER BY sales.id`,
  );
  return result.rows;
}

export async function getSaleById(id: number) {
  const result = await pool.query(
    `SELECT sales.*, customers.name AS customer_name
     FROM sales INNER JOIN customers ON customers.id = sales.customer_id
     WHERE sales.id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}

export async function insertSale(input: SaleInput) {
  if ("total" in input) {
    const result = await pool.query(
      "INSERT INTO sales (customer_id, total) VALUES ($1, $2) RETURNING *",
      [input.customer_id, input.total],
    );
    return result.rows[0];
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const total = (totalInCents(input.items) / 100).toFixed(2);
    const result = await client.query(
      "INSERT INTO sales (customer_id, total) VALUES ($1, $2) RETURNING *",
      [input.customer_id, total],
    );
    const sale = result.rows[0];
    const items = [];
    for (const item of input.items) {
      const detail = await client.query(
        `INSERT INTO sale_details (sale_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [sale.id, item.product_id, item.quantity, item.unit_price],
      );
      items.push(detail.rows[0]);
    }
    await client.query("COMMIT");
    return { ...sale, items };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
