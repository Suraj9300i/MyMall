const express = require("express");
const productController = require("../controllers/productsController");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

const router = express.Router();

router.get("/search/", productController.searchProduct);
router.get("/all/", productController.getAllProduct);
router.post("/new/", verifyTokenAndAdmin, productController.createNewProduct);
router.get("/:id/", productController.getProduct);
router.patch("/:id/", verifyTokenAndAdmin, productController.updateProduct);
module.exports = router;
