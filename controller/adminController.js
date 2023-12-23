const Admin = require("../models/adminModels");
const Validator = require("validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/userModels");
const Util = require("../utils/utils");

const GenerateAccessTokenAndRefreshToken = async (admindId) => {
  try {
    const admin = await Admin.findById(admindId);
    //   console.log(admin,"<>")
    const accessToken = await admin.GenerateAccessToken();
    const refreshToken = await admin.GenerateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error, "bb");
  }
};

const adminRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!(name && email && password)) {
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
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({
        success: false,
        message: "User already exists! please try to login!",
      });
    }

    let saveData = {
      name,
      email,
      password,
      role: String(role ? role : 2),
    };
    await Admin.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "Admin regsiter successfully!" });
  } catch (e) {
    console.log(e, "n");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const adminLogin = async (req, res) => {
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

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // compare password
    const validatePassword = await admin.comparePassword(password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrct passowrd!" });
    }

    const { accessToken, refreshToken } =
      await GenerateAccessTokenAndRefreshToken(admin._id);
    let adminData = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ sucess: true, adminData, accessToken, refreshToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const adminLogout = async (req, res) => {
  try {
    // console.log(req.middleware._id,"nn")
    const result = await Admin.findByIdAndUpdate(
      req.middleware._id,
      { $set: { refreshToken: undefined } },
      { new: true }
    );
    console.log(result, "n");
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ success: true, message: "Admin logout sucessfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const generateRefreshToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;
    let admin_id = req.middleware._id;
    console.log(admin_id, "nnnnnnnnnnnn");
    console.log(incomingRefreshToken, "n");
    const validateRefreshToken = await verifyRefreshToken(
      admin_id,
      incomingRefreshToken
    );
    if (!validateRefreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid refresh token!" });
    }
    /// find refreshtoken
    const findRefreshToken = await Admin.findOne({
      refreshToken: incomingRefreshToken,
    });
    // console.log(findRefreshToken,)
    if (findRefreshToken.refreshToken !== incomingRefreshToken) {
      return res
        .status(200)
        .json({ success: false, message: "Refresh token is expired!" });
    }

    const { accessToken, refreshToken } =
      await GenerateAccessTokenAndRefreshToken(req.middleware._id);
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ sucess: true, accessToken, refreshToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const createUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    if (!(username && email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }
    // validateEmail
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    let usercount = await User.countDocuments({
      $or: [{ username }, { email }],
    });
    // console.log(usercount, "nn");
    if (usercount > 0) {
      return res.status(400).send({
        status: false,
        message: "User name or email is already exist",
      });
    }

    let saveData = {
      username,
      email,
      password,
      createdBy: req.middleware._id,
      createdAt: new Date(),
    };

    await Util.sendEmail(username, email, password);
    await User.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "User created successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const updateUser = async (req, res) => {
  try {
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getUserList = async (req, res) => {
  try {
    let { startDate, endDate, email, username,pageNumber,pageSize} = req.body;

    startDate = startDate
      ? Util.getOnlyDateByValue(startDate) + " 00:00:00"
      : "";
    endDate = endDate ? Util.getOnlyDateByValue(endDate) + " 23:59:59" : "";
    pageNumber = Number(pageNumber ? parseInt(pageNumber) : 1);
    pageSize = Number(pageSize ? parseInt(pageSize) : 50);
    const offset = (pageNumber - 1) * pageSize
    // console.log(startDate, endDate, "n");
    let matchStage = { createdBy: req.middleware._id, isDeleted: false };
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (email) {
      matchStage.email = email;
    }

    if (username) {
      matchStage.username = username;
    }

    // console.log(matchStage, "bb");

    const pipeLine = [
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          createdBy: 1,
          createdAt: 1,
          isDeleted: 1,
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {$skip:offset},
      {$limit:pageSize}
    ]
    //  console.log(pipeLine,"mmm")
    const userList = await User.aggregate(pipeLine);
    if (userList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res.status(200).json({ success: true, dataCount:userList.length,data: userList });
  } catch (e) {
    console.log(e, "error");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const deleteUser = async (req, res) => {
  try {
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getUserDetail = async (req, res) => {
  try {
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  generateRefreshToken,
  createUser,
  updateUser,
  getUserList,
  deleteUser,
  getUserDetail,
};

const verifyRefreshToken = async (admin_id, incomingRefreshToken) => {
  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.Refresh_Token);
    //  console.log(decoded,"bb")
    return decoded._id === admin_id;
  } catch (e) {
    console.log("Error", e);
  }
};
