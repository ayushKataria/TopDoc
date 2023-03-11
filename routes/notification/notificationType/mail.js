const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
// const templates = require("./constants/templates/forgetPassword.mustache");

// const header = fs.readFileSync(templates, "utf8");
const body = fs.readFileSync(
  "constants/templates/forgetPassword.mustache",
  "utf8"
);
const header = fs.readFileSync("constants/templates/header.mustache", "utf8");
const footer = fs.readFileSync("constants/templates/footer.mustache", "utf8");

// let name = "Akash";
// const mailBody = mustache.render(body, { name });
// console.log(mailBody, "mailbody");
// const footer = fs.readFileSync(templates.footer.mustache, "utf8");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "topdoc.official22@gmail.com",
    pass: "ivkhjdzvzqviymws",
  },
});

async function userAnnouncementByMail(data, message) {
  let name = "Akash";
  const mailBody = mustache.render(header + body + footer, { name });
  console.log(mailBody, "mailbody");
  console.log("inside userAnnouncementByMail", data);
  let options = {};
  // for (let i = 0; i < data.length; i++) {
  options = {
    from: "TopDoc_Official🩺 <topdoc.official22@gmail.com>",
    // to: [`${data[i].email}`],
    to: [
      "akashneekhara20@gmail.com",
      "shukla.1997.sachin@gmail.com",
      "saisarthakmohanty1996@gmail.com",
    ],
    subject: "Welcome to TopDoc",
    html: mailBody,
  };
  await transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent:  " + info.response);
  });
  // }
}
userAnnouncementByMail("data", "message");
module.exports = { userAnnouncementByMail };
