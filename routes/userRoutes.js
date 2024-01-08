const express = require("express");
const userRouter = express.Router();
const Authorize = require("../middleware/auth");
 const userController  = require("../controller/userController");

 userRouter.post("/userlogin", userController.userLogin);
 userRouter.patch("/updatepassword",Authorize([1]), userController.updatePassword);
 userRouter.post("/forgetpassword",Authorize([1]), userController.forgetPassword);
 userRouter.post("/resetpassword",Authorize([1]), userController.resetPassword);



module.exports = userRouter;