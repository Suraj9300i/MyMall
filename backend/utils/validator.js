const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

exports.validatePhoneNumber = (number) => {
  return number.match(/\d/g).length === 10;
};

exports.getHashedValue = (value) => {
  return CryptoJS.AES.encrypt(
    value,
    process.env.PASSWORD_SECRET_PASSPHRASE
  ).toString();
};

exports.getDecryptedValue = (value) => {
  const bytes = CryptoJS.AES.decrypt(
    value,
    process.env.PASSWORD_SECRET_PASSPHRASE
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};

exports.getJWT = (data) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_PASSPHRASE, {
    expiresIn: "1d",
  });
  return token;
};
