const nodemailer = require("nodemailer");
// const fs = require("fs");
const mustache = require("mustache");
// const style =require("./constants/templates/")
const header = `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>TopDoc team 🩺</title>
    <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <style>
         body {
          font-family: Arial, sans-serif;
        }
        .container {
          width: 850px;
          margin: 0 auto;
        }
        .header {
          background-color: #f2f2f2;
          padding: 20px;
          text-align: center;
        }
        .header img {
          width: 100%;
          height: 200px;
        }
        .content {
          background-color: #ffffff;
          padding: 20px;
        }
        .content h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }
        .content p {
          font-size: 18px;
          line-height: 1.5;
          margin-bottom: 20px;
        }
        .footer {
          background-color: #f2f2f2;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #777777;
        }
        
         </style>
  
</head>
<body>
<div class="container">
            <div class="header">
              <img src="https://st3.depositphotos.com/2249091/13081/i/600/depositphotos_130811568-stock-photo-doctors-of-medicine-talking.jpg" alt="Logo">
            </div>
            <div class="content"> 
            `;

const footer = `<p>If you do not satisfy with this. Please contact us immediately at 
            <a href="topdoc.official22@gmail.com">topdoc.official22@gmail.com</a></p>
            
              <p>Thank you,</p>
            
              <p>The Topdoc Team</p>
            
             </div>
                        <div class="footer">
                          &copy; TopDoc , 2023
                        </div>
                      </div>
            </body>
            </html>
            
            
            `;

const forgetBody = `
<h1 style="text-align: center; color: #008CBA;">Reset your password</h1>
<h1 >Hello {{name}},</h1> 

<p>We have received a request to reset the password for your account. If you did not make this request, please ignore this email.</p>

<p>To reset your password, please click on the following link:</p>

  <p style="text-align: center;"><a href={{resetLink}} style="background-color: #008CBA;
  border-radius: 3px;
  color: #ffffff;
  display: inline-block;
  font-size: 16px;
  padding: 10px 20px;
  text-decoration: none;
  text-transform: uppercase;">Reset Link</a></p>
  


<p>This link will expire once you click on it. If you do not reset your password once you click on the link, you will need to request another reset link.</p>`;

const sessionDelay = `
<h1 style="text-align: center; color: #008CBA;">Appointment has been delayed</h1>

<h1 >Hello {{name}},</h1> 

<p>Sorry to inform you that the session you have booked for consultation is delayed by your doctor.</p>`;
const sessionCancel = `
<h1 style="text-align: center; color: #008CBA;">Appointment has been cancelled</h1>
<h1 >Hello {{name}},</h1> 

	<p>Sorry to inform you that the session you have booked for consultation is cancelled by your doctor.</p>
`;
const welcome = `
<h1 style="text-align: center; color: #008CBA;">Welcome to Topdoc 🩺</h1>
<h1 >Hello {{name}},</h1>

<p>We would like to welcome you to <b>Topdoc</b>. We are delighted to have you and we appreciate your trust in our services.</p>

<p>As a new user, you will have access to a wide range of features and benefits that has to offer. Our team has worked tirelessly to ensure that our Service is intuitive and easy-to-use.</p>

<p>We understand that starting with a new product can be overwhelming, but we assure you that our team is here to provide you with all the support you need. If you have any questions or concerns, please feel free to reach out to us.</p>

<p>Thank you once again for choosing <b>Topdoc</b>. We look forward to serving you and helping you succeed.</p>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "topdoc.official22@gmail.com",
    pass: "ivkhjdzvzqviymws",
  },
});

async function userAnnouncementByMail(tag, data) {
  // console.log(mailBody, "mailbody");
  try {
    console.log("inside userAnnouncementByMail", data, data.length);

    let message;
    let subject;
    let options = {};
    let mailBody;
    let resetLink;
    // for (let i = 0; i < data.length; i++) {
    if (tag.includes("forgetPassword")) {
      message = header + forgetBody + footer;
      subject = "Reset your password";

      if (data[0].role == "doctor") {
        console.log("inside doctor role");
        let link = "http://localhost:4200/signUp/changePwd?docId=";
        let id = data[0].id;
        console.log(id, "id");
        resetLink = link.concat(id);
      } else {
        console.log("inside user role");

        let link = "http://localhost:4200/signUp/changePwd?userId=";
        let id = data[0].id;
        console.log(id, "id");
        resetLink = link.concat(id);
      }
      console.log("resetlink : ", resetLink);
    } else if (tag.includes("delaySession")) {
      message = header + sessionDelay + footer;
      subject = "Appointment has been delayed";
    } else if (tag.includes("cancelSession")) {
      message = header + sessionCancel + footer;
      subject = "Appointment has been cancelled";
    } else if (tag.includes("welcome")) {
      message = header + welcome + footer;
      subject = "Welcome to TopDoc";
    }
    for (let i = 0; i < data.length; i++) {
      let name = data[i].name;

      console.log("name", name);

      if (tag.includes("forgetPassword")) {
        mailBody = mustache.render(message, { name, resetLink });
      } else {
        mailBody = mustache.render(message, { name });
      }
      options = {
        from: "TopDoc_Official🩺 <topdoc.official22@gmail.com>",
        to: [`${data[i].email}`],
        // to: [
        //   "akashneekhara20@gmail.com",
        //   "shukla.1997.sachin@gmail.com",
        //   "saisarthakmohanty1996@gmail.com",
        // ],
        subject: subject,
        html: mailBody,
      };
      await transporter.sendMail(options, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("sent:  " + info.response);
        return;
      });
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

module.exports = { userAnnouncementByMail };
