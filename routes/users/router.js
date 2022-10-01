"use strict";
var router = require("express").Router();
var controller = require("./controller");
const _ = require("underscore");
const docController = require("../doctors/controller");
const userAttributeList = require("./constants/userAttributeList");
function test(req, res) {
  res.send("APP SUCCESS");
}

router.get("/users", test);
router.post("/signup", function (req, res) {
  console.log(req.body);
  if (
    req.body.hasOwnProperty("fullName") == false ||
    req.body.fullName == null ||
    req.body.fullName == ""
  ) {
    res.status(400).send("Full name is mandatory");
  } else if (
    (!req.body.hasOwnProperty("mobileNumber") ||
      req.body.mobileNumber == null ||
      req.body.mobileNumber == "") &&
    (!req.body.hasOwnProperty("emailId") ||
      req.body.emailId == null ||
      req.body.emailId == "")
  ) {
    res.status(400).send("one of Mobile Number or Email id is mandatory");
  } else if (!req.body.hasOwnProperty("password")) {
    res.status(400).send("Password cannot be empty");
  } else if (!req.body.hasOwnProperty("confirmPassword")) {
    res.status(400).send("confirmPassword field cannot be empty");
  } else {
    if (!validatePassword(req.body.password)) {
      res.status(403).send("password is not valid");
    }
    controller
      .signup(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

router.post("/login", function (req, res) {
  if (
    !req.body.hasOwnProperty("loginId") ||
    req.body.loginId == null ||
    req.body.loginId == ""
  ) {
    res.status(400).send("Full name is mandatory");
  } else if (
    (!req.body.hasOwnProperty("mobileNumber") ||
      req.body.mobileNumber == null ||
      req.body.mobileNumber == "") &&
    (!req.body.hasOwnProperty("emailId") ||
      req.body.emailId == null ||
      req.body.emailId == "")
  ) {
    res.status(400).send("one of Mobile Number or Email id is mandatory");
  } else if (!req.body.hasOwnProperty("password")) {
    res.status(400).send("Password cannot be empty");
  } else if (!req.body.hasOwnProperty("confirmPassword")) {
    res.status(400).send("confirmPassword field cannot be empty");
  } else {
    if (!validatePassword(req.body.password)) {
      res.status(403).send("password is not valid");
    }
    controller
      .signup(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

async function addMedicalDetails(req, res) {
  try {
    let id;
    let role;
    let obj;
    const userAttributes = userAttributeList.userAttributes;
    const medicalDetailsAttributes =
      userAttributeList.userMedicalDetailsAttributes;

    if (
      req.body.hasOwnProperty("id") == false ||
      req.body.id == null ||
      req.body.id == ""
    ) {
      res.status(400).send("bad request , id cannot be empty");
    } else if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else if (
      req.body.hasOwnProperty("medicalDetails") == false ||
      req.body.id == null ||
      req.body.id == ""
    ) {
      res.status(400).send("bad request , medicalDetails cannot be empty");
    } else {
      try {
        Object.keys(req.body).forEach((key) => {
          if (!userAttributes.includes(key)) {
            res
              .status(400)
              .send("bad request , unknown attribute found in request");
            throw error;
          }
        });

        req.body.medicalDetails.forEach((medicalDetails) => {
          Object.keys(medicalDetails).forEach((key) => {
            if (!medicalDetailsAttributes.includes(key)) {
              res
                .status(400)
                .send("bad request , unknown attribute found in request");
              throw error;
            }
          });
        });
      } catch (error) {
        return;
      }

      id = req.body.id;
      role = req.body.role;
      obj = req.body;
      obj = _.omit(obj, "id", "role");
      if (
        JSON.stringify(Object.keys(obj)) === JSON.stringify(["medicalDetails"])
      ) {
        let fieldsToFetch = ["medicalDetails"];
        let dataObj = await docController.getProfileDetailsController(
          id,
          role,
          fieldsToFetch
        );
        let prevObj = dataObj.results[0].medicalDetails;
        obj.medicalDetails = [...prevObj, ...obj.medicalDetails];
        await docController
          .updateProfileDetailsController(id, role, obj)
          .then((data) => res.send(data))
          .catch((err) => res.status(err.statuscode).send(err));
      } else {
        res.status(400).send("bad request ");
      }
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

async function MedicalDetails(req, res) {
  try {
    if (
      req.body.hasOwnProperty("id") == false ||
      req.body.id == null ||
      req.body.id == ""
    ) {
      res.status(400).send("bad request , id cannot be empty");
    } else if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else {
      await controller
        .medicalDetails(req.body)
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

router.post("/userDetails/addMedicalDetails", addMedicalDetails);
router.post("/userDetails/getMedicalDetails", medicalDetails);
router.post("/userDetails/favouriteDoctor", favouriteDoctor);

module.exports = router;
