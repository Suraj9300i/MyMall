const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "backend/configs/.env" });

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("app is listening to port ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("DB not connected ");
  });
