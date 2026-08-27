import express from "express";
import type { Request, Response, NextFunction } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import dotenv from "dotenv";
import ProductosRoutes from "./routes/productoRoutes.js";
import CustomersRoutes from "./routes/customerRoutes.js";
import {pool} from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Logger: va antes de las rutas para registrar todas las peticiones
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use("/api/menu", ProductosRoutes);
app.use("/api/customers", CustomersRoutes);

const swaggerFilePath = path.resolve("./swagger-output.json");
if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
  delete swaggerDocument.host;
  delete swaggerDocument.schemes;
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("archivo swagger-output.json no encontrado");
}

app.get("/", function (req: Request, res: Response) {
  res.json({
    message: "servidor corriendo exitosamente",
  });
});

app.listen(PORT, async function () {
  console.log("servidor corriendo en http://localhost:" + PORT);
  try {
    const res = await pool.query("SELECT NOW()");
    console.log(
      `CONECTADO A POSTGRESQL CON EXITO HORA DEL SERVIDOR ${res.rows[0].now}`,
    );
  } catch (error) {
    console.error("ERROR EN LA CONEXION:", error);
  }
});