import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

// Ejecutar contra la base local de desarrollo y el servidor iniciado.
const base = process.env.TEST_API_URL ?? 'http://localhost:3000';
const pool = new pg.Pool({
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME, user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, connectionTimeoutMillis: 5000,
});

async function request(path, method = 'GET', body) {
  const response = await fetch(`${base}/api${path}`, {
    method, headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return { status: response.status, body: await response.json() };
}

test('Customers: CRUD solicitado, validación, 404 y parámetros seguros', async (t) => {
  let customerId;
  let productId;
  const payload = { name: "'); DROP TABLE products; --", email: 'prueba@example.com', phone: '55551234' };
  try {
    await t.test('POST devuelve 201 y trata SQL como texto', async () => {
      const result = await request('/customers', 'POST', payload);
      assert.equal(result.status, 201);
      customerId = result.body.id;
      assert.equal(result.body.name, payload.name);
      assert.equal(result.body.email, payload.email);
    });
    assert.ok(customerId, 'El cliente de prueba debe existir');
    await t.test('GET lista y GET por id devuelven el cliente', async () => {
      const list = await request('/customers');
      assert.equal(list.status, 200);
      assert.ok(list.body.some(row => row.id === customerId));
      const one = await request(`/customers/${customerId}`);
      assert.equal(one.status, 200);
      assert.equal(one.body.name, payload.name);
    });
    await t.test('PUT actualiza, recorta espacios y permite omitir teléfono', async () => {
      const updated = await request(`/customers/${customerId}`, 'PUT', { name: '  Cliente actualizado  ', email: payload.email });
      assert.equal(updated.status, 200);
      assert.equal(updated.body.name, 'Cliente actualizado');
      assert.equal(updated.body.phone, null);
      assert.equal((await request(`/customers/${customerId}`)).body.name, 'Cliente actualizado');
    });
    await t.test('POST y PUT rechazan datos inválidos sin modificar el cliente', async () => {
      for (const body of [{}, { ...payload, name: ' ' }, { ...payload, email: 'incorrecto' }, { ...payload, phone: 123 }, { ...payload, name: 'a'.repeat(101) }]) {
        for (const [path, method] of [['/customers', 'POST'], [`/customers/${customerId}`, 'PUT']]) {
          const result = await request(path, method, body);
          assert.equal(result.status, 400);
          assert.ok(Array.isArray(result.body.errors));
        }
      }
      assert.equal((await request(`/customers/${customerId}`)).body.name, 'Cliente actualizado');
    });
    await t.test('GET y PUT rechazan IDs inválidos', async () => {
      for (const id of ['abc', '0', '-1', '1.5', '2147483648']) {
        assert.equal((await request(`/customers/${id}`)).status, 400);
        assert.equal((await request(`/customers/${id}`, 'PUT', payload)).status, 400);
      }
    });
    await t.test('GET y PUT devuelven 404 para un cliente eliminado de prueba', async () => {
      await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
      assert.equal((await request(`/customers/${customerId}`)).status, 404);
      assert.equal((await request(`/customers/${customerId}`, 'PUT', payload)).status, 404);
    });
    await t.test('POST y PUT de productos conservan parámetros seguros', async () => {
      const created = await request('/menu', 'POST', { name: payload.name, description: 'Prueba automática', price: 10 });
      assert.equal(created.status, 201);
      productId = created.body.id;
      assert.equal(created.body.nombre, payload.name);
      const updated = await request(`/menu/${productId}`, 'PUT', { name: payload.name, description: 'Actualizado', price: 20 });
      assert.equal(updated.status, 200);
      assert.equal(updated.body.nombre, payload.name);
      assert.equal(Number(updated.body.precio), 20);
      assert.equal((await request('/menu')).status, 200);
    });
  } finally {
    try {
      if (customerId) await pool.query('DELETE FROM customers WHERE id = $1', [customerId]);
      if (productId) await pool.query('DELETE FROM products WHERE id = $1', [productId]);
    } finally { await pool.end(); }
  }
});
