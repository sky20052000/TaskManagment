require("dotenv").config();
const nodemailer = require("nodemailer");

const util = {
  sendEmail: async (username, email, password) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.User_Email,
        pass: process.env.User_Pass,
      },
    });
    try {
      transport.sendMail({
        from: process.env.User_Email,
        to: email,
        subject: "Credentails",
        html: `<h1>User login credentails </h1>
              <h2>Hello ${username}</h2>
               <h1> Login with  ${email}  ${password} this credentails  </h1>
              </div>`,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send({
        status: false,
        message: "Something went wrong there is some issue",
      });
    }
  },

  getOnlyDateByValue: (value) => {
    let dateObj1 = new Date(value);
    value =
      dateObj1.getFullYear() +
      "-" +
      ("0" + (dateObj1.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateObj1.getDate()).slice(-2);
    return value;
  },

  resetPasswordToken: async (username, email, resetPasswordToken) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.User_Email,
        pass: process.env.User_Pass,
      },
    });

    try {
      transport.sendMail({
        from: process.env.User_Email,
        to: email,
        subject: "Reset your password",
        html: `<h1>Reset Password </h1>
              <h2>Hello ${username}</h2>
              <a href= http://localhost:4000/user/resetpassword?resetPasswordToken=${resetPasswordToken}> Click here to reset your password!</a>
              </div>`,
      });
    } catch (e) {
      return res.status(500).send({
        status: false,
        message: "Something went wrong there is some issue",
      });
    }
  },
};

module.exports = util;
