import pool from "../config/db.js"; //importamos el pool de conexión a PostgreSQL

//función para obtener todos los productos de la bd
export const getAllProducts = async (
    maxPrice?: number,
    page: number = 1,
    limit: number = 10
    ) => {

        const offset = (page - 1) * limit;

    if (maxPrice !== undefined) {
        //obtenemos productos con precio menor o igual al máximo indicado
    const result = await pool.query("SELECT * FROM products WHERE price <= $1 LIMIT $2 OFFSET $3",
        [maxPrice, limit, offset]
    ); //ejecutamos la consulta para obtener todos los productos

    return result.rows; //retornamos las filas obtenidas de la consulta
}

//si no se indica un precio máximo, obtenemos todos los productos
const result = await pool.query("SELECT * FROM products LIMIT $1 OFFSET $2",
    [limit, offset]
);

return result.rows; //retornamos los productos obtenidos
};


//función para obtener un producto por su id
export const getProductById = async (id:number) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1", [id]
    );

    if (result.rows.length === 0) {
        return null; //retornamos null si no existe
    }

    return result.rows[0];
};


//función para crear un nuevo producto
export const insertProduct = async(
    name: string,
    price: number ) => {
        const result = await pool.query(
            "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *",
            [name, price]
        );

        return result.rows[0];
    };


//funcion para actualizar un producto
export const updateProduct = async(
    id: number,
    name: string,
    price: number) => {
        const result = await pool.query( //actualizamos el producto
            "UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *",
            [name, price, id]
        );

        if (result.rows.length == 0) {
            return null;
        }

        return result.rows[0]; //retornamos el producto actualizado


    }    
