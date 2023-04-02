const router = require("express").Router();

const searchField = require("../ads/controller");
// const forgetMail = require("../appointments/controller");
const forgetMail = require("./notificationType/mail");
async function forgetPassword(req, res) {
  console.log("in forget password");
  try {
    if (
      req.body.hasOwnProperty("role") == false ||
      req.body.hasOwnProperty("role") == null ||
      req.body.hasOwnProperty("role") == ""
    ) {
      res.status(400).send("bad request, role field is missing");
    } else if (
      req.body.hasOwnProperty("email") == false ||
      req.body.hasOwnProperty("email") == null ||
      req.body.hasOwnProperty("email") == ""
      // ||
      // req.body.hasOwnProperty("mobile") == false ||
      // req.body.hasOwnProperty("mobile") == null ||
      // req.body.hasOwnProperty("mobile") == ""
    ) {
      res.status(400).send("bad request, email or mobile field is missing");
    } else {
      console.log("inside else");
      // let resetLink = req.body.resetLink;
      // delete req.body.resetLink;
      console.log("req.body ", req.body);
      let output = await searchField.searchFieldInIndex(req.body);
      console.log("output : ", output);
      if (output.hits > 0) {
        let user = [
          {
            role: req.body.role,
            id: output.results[0].id,
            name: output.results[0].name,
            mobile: output.results[0].mobile,
            email: output.results[0].email,
          },
        ];
        console.log("user: ", user);
        // let medium = [mail];
        // forgetMail.triggerNotification(
        //   "forgetPassword",
        //   resetLink,
        //   user,
        //   medium
        // );
        const mail = await forgetMail.userAnnouncementByMail(
          "forgetPassword",
          user
        );
        res.send(mail);
      } else {
        res.status(400).send("bad request, enter valid email address");
      }
      //   controller
      //     .manualNotification(req.body)
      //     .then((data) => res.send(data))
      //     .catch((err) => res.status(err.statuscode).send(err));
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

router.post("/send", forgetPassword);
// module.exports = router;
module.exports = router;
