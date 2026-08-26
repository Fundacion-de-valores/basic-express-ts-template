import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import menuRouter from "./routes/menu.router.js";
import cors from "cors";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);
app.use("/api/menu", menuRouter);

app.get("/", (req: Request, res: Response) => {
  /*#swagger.tags = ['Tests']*/
  res.json({
    status: "Server online",
    version: "1.0.0",
  });
});

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});
