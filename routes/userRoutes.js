const express = require("express");
const userRouter = express.Router();
const Authorize = require("../middleware/auth");
 const userController  = require("../controller/userController");

 userRouter.post("/userlogin", userController.userLogin);
 userRouter.patch("/updatepassword",Authorize([1]), userController.updatePassword);



module.exports = userRouter;