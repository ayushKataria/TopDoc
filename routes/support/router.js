const router = require("express").Router();
const supportAttributesList = require("./constants/supportAttributeList");
const controller = require("./controller");
const docController = require("../doctors/controller");

async function createNewSupportTicket(req, res) {
  try {
    let fail = false;
    const list = supportAttributesList.createNewSupportAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        fail = true;
      }
    });
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in request");
    }

    if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else if (
      req.body.hasOwnProperty("reporterID") == false ||
      req.body.reporterID == null ||
      req.body.reporterID == ""
    ) {
      res.status(400).send("bad request , reporterID cannot be empty");
    } else if (
      req.body.hasOwnProperty("priority") == false ||
      req.body.priority == null ||
      req.body.priority == ""
    ) {
      res.status(400).send("bad request , priority cannot be empty");
    } else if (
      req.body.hasOwnProperty("fullName") == false ||
      req.body.fullName == null ||
      req.body.fullName == ""
    ) {
      res.status(400).send("bad request , fullName cannot be empty");
    } else if (
      req.body.hasOwnProperty("email") == false ||
      req.body.email == null ||
      req.body.email == ""
    ) {
      res.status(400).send("bad request , email field cannot be empty");
    } else if (
      req.body.hasOwnProperty("mobile") == false ||
      req.body.mobile == null ||
      req.body.mobile == ""
    ) {
      res.status(400).send("bad request , mobile cannot be empty");
    } else if (
      req.body.hasOwnProperty("description") == false ||
      req.body.description == null ||
      req.body.description == ""
    ) {
      res.status(400).send("bad request , description cannot be empty");
    } else if (
      req.body.hasOwnProperty("raisedOn") == false ||
      req.body.raisedOn == null ||
      req.body.raisedOn == ""
    ) {
      res.status(400).send("bad request , raisedOn cannot be empty");
    } else if (
      req.body.hasOwnProperty("status") == false ||
      req.body.status == null ||
      req.body.status == ""
    ) {
      res.status(400).send("bad request , status cannot be empty");
    } else if (req.body.status !== "waitingForSupport") {
      res
        .status(400)
        .send("bad request , invalid status value at the time of creation");
    } else {
      req.body.raisedOn = await docController.ConvertDateFormat(
        req.body.raisedOn
      );
      console.log("in router");
      await controller
        .createNewSupportTicket(req.body)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.statuscode).send(err));
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

router.post("/create", createNewSupportTicket);
module.exports = router;
