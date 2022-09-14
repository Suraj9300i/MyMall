const express = require("express");
const productController = require("../controllers/productsController");

const router = express.Router();

router.get("/all/", productController.getAllProduct);
router.post("/new/", productController.createNewProduct);
router.get("/:id/", productController.getProduct);

module.exports = router;
