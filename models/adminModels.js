const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const adminSchema = new mongoose.Schema({
               name:{type:String,required:true,trim:true},
               email:{type:String,required:true,trim:true,unique:true},
               password:{type:String,required:true,trim:true},
               refreshToken:{type:String},
               role:{type:String,default:2}

},{timestamps:true});

//hash password 
adminSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})

///generate access token 
adminSchema.methods.GenerateAccessToken = async function(){
     return Jwt.sign({
          _id:this._id,
          name:this.name,
          email:this.email,
          role:this.role
     },
     process.env.Access_Token,
     {expiresIn:"24h"}

     )
}

///refresh access token 
adminSchema.methods.GenerateRefreshToken = async function(){
    return Jwt.sign({
        _id:this._id,
        role:this.role
    },
    process.env.Refresh_Token,
    {expiresIn:"30d"}

    )
}

//compare passport

adminSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}


module.exports = new mongoose.model("Admin",adminSchema);