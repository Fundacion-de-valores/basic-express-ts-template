import { Pool } from "pg";

const pool = new Pool({
    host: process.env.DB_HOST, //dirección donde está alojado postgre
    port: Number(process.env.DB_PORT), //recordar Number para convertir el valor de texto del .env a nro
    database: process.env.DB_NAME, //nombre de la base de datos
    user: process.env.DB_USER, //usuario de postgre
    password: process.env.DB_PASSWORD,

});

export default pool; //exportamos pool para poder usarlo en otros archivos