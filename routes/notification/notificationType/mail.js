const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "topdoc.official22@gmail.com",
    pass: "ivkhjdzvzqviymws",
  },
});

async function userAnnouncementByMail(data, message) {
  console.log("inside userAnnouncementByMail", data);
  let options = {};
  for (let i = 0; i < data.length; i++) {
    options = {
      from: "TopDoc_Official🩺 <topdoc.official22@gmail.com>",
      to: [`${data[i].email}`],
      subject: "Welcome to TopDoc",
      html: `<!DOCTYPE html>
        <html>
        <head>
          <title>Welcome to TopDoc 🩺</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style type="text/css">
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              width: 850px;
              margin: 0 auto;
            }
            .header {
              background-color: #F2F2F2;
              padding: 20px;
              text-align: center;
            }
            .header img {
              width: 100%;
                    height: 200px;
                    
            }
            .content {
              background-color: #FFFFFF;
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
              background-color: #F2F2F2;
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
              <img src="https://st3.depositphotos.com/2249091/13081/i/600/depositphotos_130811568-stock-photo-doctors-of-medicine-talking.jpg" alt="Company Logo">
            </div>
            <div class="content">
              <h1 >Hello ${data[i].name},</h1>
              <h1>Welcome to TopDoc 🩺!</h1>
              <p>We are thrilled to have you as a part of our team. We are confident that you will make a valuable contribution to our organization and we look forward to your ideas and insights.</p>
              <p>If you have any questions or need assistance with anything, please don't hesitate to reach out to our Whatsapp group.</p>
              <p>Once again, welcome to the team!</p>
            </div>
            <div class="footer">
              &copy; TopDoc , 2023
            </div>
          </div>
           
        </body>
        </html>
        `,
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

module.exports = { userAnnouncementByMail };
