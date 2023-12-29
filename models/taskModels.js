const mongoose = require("mongoose");

const TaskShcema = new mongoose.Schema({
              Task_name:{type:String,required:true,trim:true,unique:true,maxLength:30},
              Task_description:{type:String,requied:true,trim:true},
              Task_title:{type:String,requied:true,trim:true},
              Task_start_date:{type:Date, required:true},
              Task_complete_date:{type:Date, default:null},
              createdBy: { type:String, required:true},
              userId: {type:String, required:true},
              Task_due_date:{type:Date, default:null},
              createdAt:{type:Date},
              updatedAt:{type:Date}
           

}
,{timestamps:true});

 module.exports = new mongoose.model("Task", TaskShcema)