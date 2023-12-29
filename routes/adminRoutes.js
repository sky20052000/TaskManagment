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
adminRouter.delete("/delete/:id", Authorize([2]),adminController.deleteUser);
adminRouter.get("/dounloadExcel", Authorize([2]), adminController.exportExcelFile);


//////////  Task managment /////////
adminRouter.post("/addtask", Authorize([2]), adminController.createTask);
adminRouter.put("/updatetask", Authorize([2]), adminController.updateTask);
adminRouter.get("/gettasklist", Authorize([2]), adminController.getTaskList);
adminRouter.get("/gettaskdetail/:_id", Authorize([2]), adminController.getTaskDetail);
adminRouter.delete("/deletetask/:_id", Authorize([2]),adminController.deleteTask);


module.exports = adminRouter;

