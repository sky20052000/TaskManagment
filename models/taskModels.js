const mongoose = require("mongoose");

const TaskShcema = new mongoose.Schema({
              Task_name:{type:String,required:true,trim:true,unique:true,maxLength:30},
              Task_description:{type:String,requied:true,trim:true},
              Task_title:{type:String,requied:true,trim:true},
              createdBy: { type:String, required:true},
              createdAt:{type:Date},
              updatedAt:{type:Date}
           

}
,{timestamps:true});

 module.exports = new mongoose.model("Task", TaskShcema)