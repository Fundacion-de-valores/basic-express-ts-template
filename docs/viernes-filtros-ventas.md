# Viernes: filtros, paginación y ventas

Esta entrega continúa sobre la rama del jueves. Integrar los PR anteriores antes
de revisar el diff final del viernes hacia main. No hacer merge sin aprobación.

## Preparación

Ejecutar `sql/002-create-sales.sql` en la base de `.env` después del SQL de customers.
Agrega `sales` (customer_id, total, created_at) y `sale_details`
(sale_id, product_id, quantity, unit_price), con claves foráneas.

## Filtros y paginación

`GET /api/menu` devuelve un arreglo, ordenado por id, con página 1 y límite 10
por defecto. `maxPrice` es opcional, finito y no negativo; filtra la columna real
`precio`. `page` debe ser entero entre 1 y 2147483647 y `limit` entre 1 y 100.
Valores vacíos, repetidos, inválidos o parámetros desconocidos responden 400. Una página sin resultados
devuelve `[]`. Los valores de WHERE, LIMIT y OFFSET están parametrizados.

Ejemplos para Swagger:

- `/api/menu?maxPrice=50`
- `/api/menu?page=1&limit=5`
- `/api/menu?page=2&limit=5`
- `/api/menu?maxPrice=100&page=1&limit=3`

## Ventas

GET `/api/sales` y `/api/sales/:id` incluyen `customer_name` con INNER JOIN.
Un ID inexistente responde 404; un ID inválido, 400.

POST `/api/sales` acepta la versión simple:

```json
{ "customer_id": 1, "total": 255 }
```

O la versión extendida (usar IDs existentes):

```json
{
  "customer_id": 1,
  "items": [
    { "product_id": 2, "quantity": 3, "unit_price": 45 },
    { "product_id": 5, "quantity": 1, "unit_price": 120 }
  ]
}
```

No enviar `total` junto con `items`: en la versión extendida se calcula en
centavos a partir de los items, para evitar errores de suma con decimales.
Zod valida IDs, importes no negativos con máximo dos decimales, de 1 a 100 items,
cantidades enteras de 1 a 10000 y unit_price máximo 999999.99.
El total máximo es 9999999999.99. Datos inválidos responden 400.

La versión extendida usa una sola conexión de `pool.connect()` y ejecuta BEGIN,
INSERT de cabecera, INSERT de cada detalle y COMMIT. Ante un error ejecuta
ROLLBACK y responde 500, como pide el reto; finalmente libera el cliente.
Por ejemplo, un product_id inexistente revierte toda la venta.
La respuesta 201 incluye la venta y sus items. GET devuelve la cabecera con nombre
del cliente, según el alcance del enunciado.

Referencia: https://node-postgres.com/features/transactions

## Pruebas

1. `pnpm run build`
2. `pnpm run dev`
3. Abrir http://localhost:3000/api/docs.
4. En otra terminal: `node --env-file=.env tests/friday.integration.mjs`.
5. Regresión de clientes: `node --env-file=.env tests/customers.integration.mjs`.

Para otro puerto configurar `TEST_API_URL`. Ejecutar las suites una por una en
la base de desarrollo. Crean registros temporales y eliminan solo sus propios
registros; las secuencias de IDs avanzan. La prueba de rollback provoca un error
de clave foránea intencional que aparece en el log del servidor.
