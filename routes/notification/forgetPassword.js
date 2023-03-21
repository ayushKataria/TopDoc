const searchField = require("../ads/controller");
const forgetMail = require("../appointments/controller");
function forgetPassword(req, res) {
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
      req.body.hasOwnProperty("email") == "" ||
      req.body.hasOwnProperty("mobile") == false ||
      req.body.hasOwnProperty("mobile") == null ||
      req.body.hasOwnProperty("mobile") == ""
    ) {
      res.status(400).send("bad request, email or mobile field is missing");
    } else {
      console.log("inside else");
      let output = searchField.searchFieldInIndex(req);
      console.log("output : ", output);
      if (output.hits > 0) {
        let user = {
          id: output.results.id,
          name: output.results.name,
          mobile: output.results.mobile,
          email: output.results.email,
        };
        forgetMail.triggerNotification("forgetPassword", message, user);
      } else {
        res.status(400).send("bad request, enter valid email or mobile number");
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

module.exports = { forgetPassword };
