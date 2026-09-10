import express from "express";
import swaggerRouter from "./routes/swagger.router.js";
import productRouter from "./routes/product.routes.js";
import customerRouter from "./routes/customer.routes.js";
import cors from "cors";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);

app.get("/", (req, res) => {
  /*#swagger.tags = ['Tests']*/
  res.json({
    status: "Server online",
    version: "1.0.0"
  });
});

app.use("/api", productRouter);
app.use("/api", customerRouter);

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});