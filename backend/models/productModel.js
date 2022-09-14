const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "please enter product name"] },
    description: {
      type: String,
      required: [true, "please enter product description"],
    },
    image: { type: String, required: [true, "please enter image location"] },
    price: {
      actualPrice: {
        type: Number,
        required: [true, "please enter price"],
        default: 0,
      },
      discount: { type: Number, default: 0 },
    },
    categories: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0 },
      allReviews: [
        {
          user: { type: String, required: true },
          rating: { type: Number, required: true },
          body: { type: String, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
    },
    stocks: { type: Number, default: 0 },
    transactions: {
      totalSells: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
