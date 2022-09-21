const userModel = require("../models/userModel");
const validator = require("../utils/validator");

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      user: { ...user._doc },
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const user = await userModel.find();
    res.status(200).json({
      status: "success",
      user: { ...user },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const newData = req.body;
    const notAllowed = ["email", "password", "isAdmin"];
    notAllowed.forEach((key) => {
      if (newData.hasOwnProperty(key)) {
        return res.status(404).json({ message: "not able to change" });
      }
    });
    console.log({ ...newData });
    const updatedData = await userModel.findByIdAndUpdate(req.params.id, {
      $set: { ...newData },
    });
    res.status(200).json({ message: "success", updatedData });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};
