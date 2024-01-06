const User = require("../models/userModels");
const Validator = require("validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const Util = require("../utils/utils");
const bcrypt = require("bcrypt");

const GenerateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    //   console.log(admin,"<>")
    const accessToken = await user.GenerateAccessToken();
    const refreshToken = await user.GenerateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "bb");
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    // validate email
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // compare password
    const validatePassword = await user.comparePassword(password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrct passowrd!" });
    }

    const { accessToken, refreshToken } =
      await GenerateAccessTokenAndRefreshToken(user._id);
    let userData = {
      _id: user._id,
      name: user.username,
      email: user.email,
      role: user.role,
    };
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ sucess: true, userData, accessToken, refreshToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!(password && confirmPassword)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password mismatch!" });
    }
    const user = await User.findById(req.middleware?._id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists!" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: req.middleware?._id },
      { $set: { password: hashPassword } },
      { new: true }
    );
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
  userLogin,
  updatePassword,
};
