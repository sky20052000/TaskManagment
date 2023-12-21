const jwt = require("jsonwebtoken");
require("dotenv").config()
module.exports = (roles = []) => {
    return (req, res, next) => {
      let token =
        req.cookies?.accessToken || req.headers["Authorization"] || req.body.token;
        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
          }
      if(!token){
        return res.status(401).json({success:false, message:"Invalid authorization token!"});
      }
        try{
         // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.Access_Token);
         if (roles.includes(Number(decoded.role))) {
                req.middleware = decoded
            next(); 
          } else {
            // user's role is not authorized
          return res.status(401).json({ status:false,is_authenticated: false,message: 'Unauthorized' });
          }


        }catch(e){
            res.status(401).send({
                status: false,
                is_authenticated: false,
                message: e.message
              });
        }
      
    }
  };

