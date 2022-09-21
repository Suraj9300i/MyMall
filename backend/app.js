const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/productsRoute");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/product/", productRouter);

module.exports = app;
