import pool from "../config/db.js";

export const getAllCustomers = async () => {
  const result = await pool.query(
    "SELECT * FROM custumers"
  );

  return result.rows;
};

export const getCustomerById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM custumers WHERE id = $1",
    [id]
  );

  return result.rows[0] ?? null;
};

export const insertCustomer = async (
  name: string,
  email: string,
  phone_number: string
) => {
  const result = await pool.query(
    `INSERT INTO custumers (name, email, phone_number)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, phone_number]
  );

  return result.rows[0];
};

export const updateCustomer = async (
  id: number,
  name: string,
  email: string,
  phone_number: string
) => {
  const result = await pool.query(
    `UPDATE custumers
     SET name = $1,
         email = $2,
         phone_number = $3
     WHERE id = $4
     RETURNING *`,
    [name, email, phone_number, id]
  );

  return result.rows[0] ?? null;
};