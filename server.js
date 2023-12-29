require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const Connection = require("./database/connection");
Connection();
const app = express();
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors('*'));
app.use(cookieParser());

//set route 
app.use("/admin",adminRouter);
app.use("/user",userRouter);


// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('That endpoint does not exist!'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send({status:false,message:err.message}); 
});

app.listen(process.env.Port,()=>{
    console.log(`Server listening on the: ${process.env.Host}:${process.env.Port}`)
});
