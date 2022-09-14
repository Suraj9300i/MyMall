const productModel = require("../models/productModel");

const createNewProduct = async (req, res) => {
  try {
    const product = new productModel(req.body);
    const data = await product.save();
    res.status(200).json({
      message: "success",
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    console.log(products);
    res.status(200).json({
      status: "success",
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrongs" });
  }
};

module.exports = { createNewProduct, getProduct, getAllProduct };
