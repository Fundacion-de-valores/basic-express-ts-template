import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import pool from './config/db';

const port = process.env.PORT; 



const app = express();

// Middlewares 
app.use(express.json());
app.use(cors())

app.use("/api/docs", swaggerRouter) 


app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

app.get('/api/menu', async (req, res) => {
  /*#swagger.tags = ['Menu']*/
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar el menú:', error);
    res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos' });
  }
});

app.listen(port, () => {
    console.log(`URL: http://localhost:${port}`);
});