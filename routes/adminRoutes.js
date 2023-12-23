const express = require("express");
const adminController = require("../controller/adminController");
 const Authorize = require("../middleware/auth");
const adminRouter = express.Router();
adminRouter.post("/adminregister", adminController.adminRegister);
adminRouter.post("/login", adminController.adminLogin);
adminRouter.post("/logout",Authorize([2]),adminController.adminLogout);
adminRouter.post("/generate-refresh-token", Authorize([1,2]), adminController.generateRefreshToken);

////////// create user /////////
adminRouter.post("/create", Authorize([2]), adminController.createUser);
adminRouter.put("/upate", Authorize([2]), adminController.updateUser);
adminRouter.post("/getuserlist", Authorize([2]), adminController.getUserList);
adminRouter.post("/getdetail", Authorize([2]), adminController.getUserDetail);
adminRouter.delete("/delete/:id", adminController.deleteUser);


//////////  Task managment /////////


module.exports = adminRouter;

