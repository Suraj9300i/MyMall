const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../auth/auth");
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/all/",verifyTokenAndAdmin, userController.getAllUser);
router.post("/new/", auth.registerUser);
router.post("/login/", auth.loginUser);
router.delete("/logout/", auth.logoutUser);
router.get("/:id/",verifyTokenAndAuthorization, userController.getUser);
router.patch("/resetPassword/", auth.resetPassword);
router.patch("/resetPassword/:token", auth.resetPasswordWithToken);
router.patch("/:id/",verifyTokenAndAuthorization, userController.updateUserData);

module.exports = router;
