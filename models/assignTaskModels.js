const mongoose = require("mongoose");

const assignTaskShcema = new mongoose.Schema(
  {
    User_Id:{type:String,required:true},
    Task_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxLength: 30,
    },
    Task_Status:{type:String, enum:["Pending","Complete"],default:"Pending"},
    CreatedBy: { type: String, required: true },
    Task_due_date: { type: String, required: true },
    CreatedAt: { type: Date },
    UpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("AssignTask", assignTaskShcema);
