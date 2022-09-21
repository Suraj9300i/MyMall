const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      minLength: [6, "password should be at least 6 character"],
      required: [true, "password is required"],
    },
    phoneNumber: { type: String, required: [true, "phone number is required"] },
    gender: { type: String },
    address: { type: String },
    profilePhoto: { type: String },
    webToken: { type: String },
    isAdmin: { type: Boolean, default: false },

    resetTokenString: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetTokenString = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("users", userSchema);
