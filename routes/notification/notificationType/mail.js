const nodemailer = require("nodemailer");
const fs = require("fs");
const mustache = require("mustache");
// const body = fs.readFileSync(
//   "constants/templates/forgetPassword.mustache",
//   "utf8"
// );
// const header = fs.readFileSync("constants/templates/header.mustache", "utf8");
// const footer = fs.readFileSync("constants/templates/footer.mustache", "utf8");

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

function sendMailByTag(data) {
  let message;
  const header = fs.readFileSync("constants/templates/header.mustache", "utf8");
  const footer = fs.readFileSync("constants/templates/footer.mustache", "utf8");
  if (data.tag.includes("delaySession")) {
    const body = fs.readFileSync(
      "constants/templates/sessionDelay.mustache",
      "utf8"
    );
    message = header + body + footer;
    userAnnouncementByMail(data, message);
  }
  if (data.tag.includes("cancelSession")) {
    const body = fs.readFileSync(
      "constants/templates/sessionCancel.mustache",
      "utf8"
    );
    message = header + body + footer;
    userAnnouncementByMail(data, message);
  }
  if (data.tag.includes("welcome")) {
    const body = fs.readFileSync(
      "constants/templates/welcome.mustache",
      "utf8"
    );
    message = header + body + footer;
    userAnnouncementByMail(data, message);
  }
  if (data.tag.includes("forgetPassword")) {
    const body = fs.readFileSync(
      "constants/templates/forgetPassword.mustache",
      "utf8"
    );
    message = header + body + footer;
    userAnnouncementByMail(data, message);
  }
}

async function userAnnouncementByMail(data, message) {
  // let name = "Akash";

  // console.log(mailBody, "mailbody");
  console.log("inside userAnnouncementByMail", data);
  let options = {};
  for (let i = 0; i < data.length; i++) {
    let name = data[i].name;
    const mailBody = mustache.render(message, { name });
    options = {
      from: "TopDoc_Official🩺 <topdoc.official22@gmail.com>",
      to: [`${data[i].email}`],
      // to: [
      //   "akashneekhara20@gmail.com",
      //   "shukla.1997.sachin@gmail.com",
      //   "saisarthakmohanty1996@gmail.com",
      // ],
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
  }
}

module.exports = { userAnnouncementByMail, sendMailByTag };
