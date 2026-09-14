import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const base = process.env.TEST_API_URL ?? 'http://localhost:3000';
const pool = new pg.Pool({
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, connectionTimeoutMillis: 5000,
});

async function request(path, body) {
  const response = await fetch(`${base}/api${path}`, body === undefined ? {} : {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test('Viernes: filtros, paginación, ventas y transacciones con PostgreSQL', async (t) => {
  const productIds = [];
  let customerId;
  let missingProductId;
  try {
    const customer = await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING id', ["Cliente prueba ' SQL", 'viernes@example.com']);
    customerId = customer.rows[0].id;
    for (const price of [0, 20, 50, 100, 101, 150, 200, 250, 300, 350, 400, 450]) {
      const result = await pool.query('INSERT INTO products (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING id', [`Prueba viernes ${price}`, 'Registro temporal', price]);
      productIds.push(result.rows[0].id);
    }
    const deleted = await pool.query('INSERT INTO products (nombre, precio) VALUES ($1, $2) RETURNING id', ['Producto para probar rollback', 1]);
    missingProductId = deleted.rows[0].id;
    await pool.query('DELETE FROM products WHERE id = $1', [missingProductId]);

    const all = (await pool.query('SELECT * FROM products ORDER BY id')).rows;
    await t.test('Sin parámetros retorna la primera página de 10', async () => {
      const result = await request('/menu');
      assert.equal(result.status, 200);
      assert.deepEqual(result.body, all.slice(0, 10));
    });
    await t.test('maxPrice incluye el límite y acepta cero', async () => {
      for (const maxPrice of [0, 50]) {
        const result = await request(`/menu?maxPrice=${maxPrice}&limit=100`);
        assert.equal(result.status, 200);
        assert.deepEqual(result.body, all.filter(p => Number(p.precio) <= maxPrice).slice(0, 100));
      }
    });
    await t.test('Páginas 1 y 2 tienen el orden esperado sin repetirse', async () => {
      for (const page of [1, 2]) {
        const result = await request(`/menu?page=${page}&limit=5`);
        assert.equal(result.status, 200);
        assert.deepEqual(result.body, all.slice((page - 1) * 5, page * 5));
      }
    });
    await t.test('Filtro combinado con paginación y página vacía', async () => {
      const result = await request('/menu?maxPrice=100&page=1&limit=3');
      assert.equal(result.status, 200);
      assert.deepEqual(result.body, all.filter(p => Number(p.precio) <= 100).slice(0, 3));
      const empty = await request('/menu?page=2147483647&limit=100');
      assert.equal(empty.status, 200);
      assert.deepEqual(empty.body, []);
    });
    await t.test('Query strings inválidos o repetidos devuelven 400', async () => {
      for (const query of ['maxPrice=abc', 'maxPrice=', 'maxPrice=-1', 'maxPrice=Infinity', 'maxPrice=1&maxPrice=2', 'maxPrice[x]=1', 'page=0', 'page=-1', 'page=1.5', 'page=Infinity', 'limit=0', 'limit=101', 'limit=5&limit=2', 'page=1%3BDROP%20TABLE%20products']) {
        assert.equal((await request(`/menu?${query}`)).status, 400, query);
      }
    });
    let simpleId;
    await t.test('POST simple devuelve 201 y guarda total', async () => {
      const result = await request('/sales', { customer_id: customerId, total: 25.50 });
      assert.equal(result.status, 201);
      simpleId = result.body.id;
      assert.equal(Number(result.body.total), 25.50);
    });
    await t.test('GET lista e individual incluyen customer_name mediante JOIN', async () => {
      assert.ok(simpleId);
      const list = await request('/sales');
      assert.equal(list.status, 200);
      assert.ok(list.body.some(sale => sale.id === simpleId && sale.customer_name === "Cliente prueba ' SQL"));
      const one = await request(`/sales/${simpleId}`);
      assert.equal(one.status, 200);
      assert.equal(one.body.customer_name, "Cliente prueba ' SQL");
    });
    await t.test('GET inexistente da 404 e IDs inválidos dan 400', async () => {
      assert.ok(simpleId);
      await pool.query('DELETE FROM sales WHERE id = $1', [simpleId]);
      assert.equal((await request(`/sales/${simpleId}`)).status, 404);
      for (const id of ['abc', '0', '-1', '1.5', '2147483648']) {
        assert.equal((await request(`/sales/${id}`)).status, 400);
      }
    });
    await t.test('POST rechaza cuerpo inválido, fracciones de centavo y total ambiguo', async () => {
      for (const body of [{}, { customer_id: customerId }, { customer_id: '1', total: 10 }, { customer_id: customerId, total: -1 }, { customer_id: customerId, total: 1.001 }, { customer_id: customerId, items: [] }, { customer_id: customerId, items: [{ product_id: productIds[0], quantity: 0, unit_price: 1 }] }, { customer_id: customerId, total: 1, items: [{ product_id: productIds[0], quantity: 1, unit_price: 1 }] }]) {
        assert.equal((await request('/sales', body)).status, 400);
      }
    });
    await t.test('Transacción confirma cabecera y detalles y calcula total en centavos', async () => {
      const result = await request('/sales', { customer_id: customerId, items: [
        { product_id: productIds[0], quantity: 3, unit_price: 0.10 },
        { product_id: productIds[1], quantity: 1, unit_price: 0.20 },
      ] });
      assert.equal(result.status, 201);
      assert.equal(Number(result.body.total), 0.50);
      assert.equal(result.body.items.length, 2);
      assert.ok(result.body.items.every(item => item.sale_id === result.body.id));
      const persisted = await pool.query('SELECT * FROM sale_details WHERE sale_id = $1 ORDER BY id', [result.body.id]);
      assert.deepEqual(result.body.items, persisted.rows);
    });
    await t.test('Fallo del segundo item revierte cabecera y primer detalle; la conexión sigue usable', async () => {
      const count = async () => (await pool.query('SELECT (SELECT count(*) FROM sales WHERE customer_id = $1) AS sales, (SELECT count(*) FROM sale_details d INNER JOIN sales s ON s.id = d.sale_id WHERE s.customer_id = $1) AS details', [customerId])).rows[0];
      const before = await count();
      const result = await request('/sales', { customer_id: customerId, items: [
        { product_id: productIds[0], quantity: 1, unit_price: 10 },
        { product_id: missingProductId, quantity: 1, unit_price: 10 },
      ] });
      assert.equal(result.status, 500);
      assert.deepEqual(await count(), before);
      const next = await request('/sales', { customer_id: customerId, items: [{ product_id: productIds[0], quantity: 1, unit_price: 5 }] });
      assert.equal(next.status, 201);
    });
  } finally {
    try {
      if (customerId) {
        await pool.query('DELETE FROM sale_details WHERE sale_id IN (SELECT id FROM sales WHERE customer_id = $1)', [customerId]);
        await pool.query('DELETE FROM sales WHERE customer_id = $1', [customerId]);
        await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
      }
      await pool.query('DELETE FROM products WHERE id = ANY($1::int[])', [productIds]);
      if (missingProductId) await pool.query('DELETE FROM products WHERE id = $1', [missingProductId]);
    } finally { await pool.end(); }
  }
});
