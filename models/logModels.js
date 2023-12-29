const mongoose = require("mongoose");

const LogShcema = new mongoose.Schema({
}
,{timestamps:true});

 module.exports = new mongoose.model("Log", LogShcema)