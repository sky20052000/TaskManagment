  const mongoose = require("mongoose");
  require("dotenv").config();

  const Connection = async()=>{
         try{
              const conn = await mongoose.connect(process.env.Mongo_url);
              if(!conn){
                   console.log("Mongoose connection failed!");
              }
              console.log("Mongoose connected to database!");

         }catch(e){
            process.nextTick(1)
            console.log("Mongoose connection failed!",e);
         }
  }

  module.exports = Connection;