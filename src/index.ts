import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import productRouter from "./routes/product.routes.js"; //importamos las rutas de los productos
import customerRouter from "./routes/customer.routes.js";

const port = process.env.PORT; 

const app = express();

// Middlewares 
app.use(express.json());
app.use(cors())

app.use("/api/docs", swaggerRouter); //conectamos las rutas swagger, productos y clientes a la aplicación
app.use("/api", productRouter);
app.use("/api", customerRouter);

//endpoint de prueba
app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});


app.listen(port, () => {
    console.log(`URL: http://localhost:${port}`);
});

