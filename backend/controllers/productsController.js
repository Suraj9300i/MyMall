const productModel = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");

exports.createNewProduct = async (req, res) => {
  try {
    const { actualPrice, discount } = req.body;
    const product = new productModel({
      ...req.body,
      price: actualPrice - (actualPrice * discount) / 100,
    });
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

exports.getProduct = async (req, res) => {
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

exports.getAllProduct = async (req, res) => {
  try {
    const data = await productModel.find();
    const originalProducts = [...data];
    const products = originalProducts.map(
      (product) =>
        new Object({
          name: product.name,
          description: product.description,
          imageSrc: product.image,
          price: product.price,
          id: product._id,
        })
    );
    res.status(200).json({
      status: "success",
      totalProducts: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.searchProduct = async (req, res) => {
  console.log("search", req.query);
  try {
    const apiFeatures = new APIFeatures(
      productModel.find(),
      req.query
    ).filter();
    const data = await apiFeatures.query;
    const originalProducts = [...data];
    const products = originalProducts.map(
      (product) =>
        new Object({
          name: product.name,
          description: product.description,
          price: product.price,
          imageSrc: product.image,
        })
    );
    res.status(200).json({
      status: "success",
      totalObjects: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};
