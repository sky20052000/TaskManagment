const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userShcema = new mongoose.Schema({
              username:{type:String,required:true,trim:true,unique:true,maxLength:30},
              email:{type:String,requied:true,trim:true,unique:true},
              password:{type:String,requied:true,trim:true},
              profile:{type:String, default:null},
              refreshToken:{type:String},
              createdBy: { type:String, required:true},
              isDeleted:{type:Boolean, default:false},
              createdAt:{type:Date},
              updatedAt:{type:Date}
           

}
,{timestamps:true});

 //hash password 
 userShcema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})


 module.exports = new mongoose.model("User", userShcema)