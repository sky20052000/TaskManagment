const express = require("express");
const assignTaskRouter = express.Router();
const Authorize = require("../middleware/auth");
 const assignTaskController = require("../controller/assignTaskController");

assignTaskRouter.post("/assigntask", assignTaskController.assignTask);




module.exports = assignTaskRouter;