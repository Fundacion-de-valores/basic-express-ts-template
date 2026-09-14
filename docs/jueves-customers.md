# Jueves: API de clientes

La rama del jueves se prepara sobre el trabajo de `feature/zod-validation`,
por autorización del estudiante mientras el PR del miércoles espera revisión.
Antes de integrar el jueves, debe integrarse el miércoles y revisarse el diff hacia main.

## Base de datos

Ejecuta `sql/001-create-customers.sql` en la base configurada en `.env`, usando pgAdmin.
Se eligieron las columnas `id`, `name`, `email` y `phone` porque todavía no existía
la tabla y el enunciado no especificaba sus campos.

## Endpoints

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | /api/customers | 200, arreglo de clientes |
| GET | /api/customers/:id | 200 o 404 |
| POST | /api/customers | 201; datos inválidos: 400 |
| PUT | /api/customers/:id | 200; datos inválidos: 400; inexistente: 404 |

POST y PUT requieren `name` (1–100 caracteres) y `email` válido (máximo 254).
`phone` es opcional (1–30 caracteres). Se recortan espacios exteriores.
PUT reemplaza los campos: omitir `phone` lo guarda como NULL.
Los IDs deben ser enteros positivos dentro del rango INTEGER de PostgreSQL.

```json
{
  "name": "Ana López",
  "email": "ana@example.com",
  "phone": "55551234"
}
```

## Verificación

1. `pnpm run build`
2. `pnpm run dev`
3. Abrir http://localhost:3000/api/docs y probar Customers y Products.
4. En otra terminal: `node --env-file=.env tests/customers.integration.mjs`.

Las pruebas requieren la base local y el servidor iniciado. Crean y eliminan
únicamente sus propios registros de prueba; las secuencias de IDs avanzan.
Para otro puerto, define `TEST_API_URL`, por ejemplo `http://localhost:3001`.
Cubren los cuatro endpoints, 404, validación, IDs inválidos y SQL tratado como
texto en clientes y productos. Las consultas insertProduct y updateProduct
ya utilizaban parámetros y RETURNING *; no necesitaron modificaciones.
