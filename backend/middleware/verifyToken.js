const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const verifyToken = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_PASSPHRASE, (err, decoded) => {
      if (err) {
        return res.status(402).json({ message: "token invalid", err });
      }
      req.user = decoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "user not authorized" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await userModel.findById(req.user.id);
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
      };
      next();
    } catch (err) {
      return res.status(500).json({ message: "something went wrong" });
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyTokenAndAuthorization(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(501).json({ message: "you are not allowed to do" });
    }
  });
};

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin };
