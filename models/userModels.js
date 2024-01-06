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
              role:{type:String},
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

///generate access token 
userShcema.methods.GenerateAccessToken = async function(){
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
userShcema.methods.GenerateRefreshToken = async function(){
    return Jwt.sign({
        _id:this._id,
        role:this.role
    },
    process.env.Refresh_Token,
    {expiresIn:"30d"}

    )
}

//compare passport
userShcema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}



 module.exports = new mongoose.model("User", userShcema)