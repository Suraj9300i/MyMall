const userModel = require("../models/userModel");
const validator = require("../utils/validator");
const sendEmail = require("../utils/sendEmail");
const  crypto = require("crypto")
exports.registerUser = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    if (
      !validator.validateEmail(email) ||
      !validator.validatePhoneNumber(phoneNumber)
    ) {
      res.status(500).json({ message: "invalid email and phonenumber" });
    }

    const userData = new userModel({
      name: req.body.name,
      email: email,
      password: validator.getHashedValue(req.body.password),
      phoneNumber: phoneNumber,
      gender: req.body?.gender || "",
      address: req.body?.address || "",
      profilePhoto:
        req.body?.profilePhoto ||
        "https://media.istockphoto.com/vectors/profile-picture-vector-illustration-vector-id587805156?k=20&m=587805156&s=612x612&w=0&h=Ok_jDFC5J1NgH20plEgbQZ46XheiAF8sVUKPvocne6Y=",
      webToken: "",
    });

    const newUser = await userData.save();
    console.log("new user", newUser);
    res.status(200).json({
      status: "success",
      data: { ...newUser._doc },
    });
  } catch (err) {
    res.status(500).json({ message: "something went wronggggg" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.find({ email });
    if (!user) {
      res.status(404).json({ message: "user not registered" });
    }
    const originalPassword = validator.getDecryptedValue(user[0].password);
    if (password !== originalPassword) {
      res.status(400).json({ message: "wrong password" });
    }
    const accessToken = validator.getJWT({ id: user[0].id });
    await userModel.findByIdAndUpdate(user[0].id, {
      $set: {
        webToken: accessToken,
      },
    });
    res
      .status(200)
      .cookie("token", accessToken)
      .json({
        status: "success",
        data: {
          email,
          accessToken,
          id: user[0]._id,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.cookie("token", undefined);
    if (req?.user?.id) {
      await userModel.findByIdAndUpdate(req.user.id, {
        $set: { webToken: undefined },
      });
    }
    req.user = undefined;
    res.status(200).json({ message: "user logged  out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetPassword/${resetToken}`;
    const message = resetPasswordURL;

    try {
      await sendEmail({
        email: user.email,
        subject: "MyMall - Reset Password",
        message,
      });
      res.status(200).json({
        message: `reset link has been successfully sent to ${user.email}`,
      });
    } catch (err) {
      user.resetTokenString = undefined;
      user.resetTokenExpire = undefined;
      await user.save();
      res.status(500).json({ message: "reset email failed", err });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
};

exports.resetPasswordWithToken = async(req,res) => {
  try{
    const {newPassword,confirmPassword} = req.body;
    if(newPassword !== confirmPassword){
      return res.status(400).json({message:"password donot match"})
    }
    const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    const user = await userModel.findOne({resetTokenString:token,resetTokenExpire:{$gt:Date.now()}});
    if(!user){
      return res.status(501).json({ message: "reset link expire" });
    }
    console.log("userer:- ",user)
    user.password = validator.getHashedValue(newPassword);
    user.resetTokenString = undefined;
    user.resetTokenExpire = undefined;
    await user.save();
    res.status(200).json({ message: "password reset successfull" });
  }
  catch(err){
    console.log(err);
    res.status(500).json({ message: "something went wrong" ,err:err});
  }
}