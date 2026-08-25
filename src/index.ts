import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import pool from "./config/db.js"; //importamos el pool

const port = process.env.PORT; 



const app = express();

// Middlewares 
app.use(express.json());
app.use(cors())

app.use("/api/docs", swaggerRouter) 

//endpoint de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

//endpoint para obtener todos los productos del menú
app.get("/api/menu", async(req: Request, res: Response) => {
    /*#swagger.tags = ['Menu']*/

    try{
        const result = await pool.query("SELECT * FROM products"); //hacemos una consulta a la tabla products

        res.json(result.rows); 
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener los productos"
        });
    }
});

app.listen(port, () => {
    console.log(`URL: http://localhost:${port}`);
});