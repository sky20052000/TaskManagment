const User = require("../models/userModels");
const Validator = require("validator");
const jwt = require("jsonwebtoken");


const assignTask = async (req, res) => {
  try {
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
    assignTask,

};
