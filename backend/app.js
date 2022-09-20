const express = require("express");
const morgan = require("morgan");
const productRouter = require("./routes/productsRoute");
const userRouter = require("./routes/usersRoute");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/product/", productRouter);

module.exports = app;
