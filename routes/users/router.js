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
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .signup(req.body)
      .then((data) => {
        console.log(data);
        res.send(data);
      })
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

router.post("/login", function (req, res) {
  if (
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
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .login(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

router.post("/changePassword", function (req, res) {
  console.log(req.body);
  if (
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
  } else if (!req.body.hasOwnProperty("newPassword")) {
    res.status(400).send("Password cannot be empty");
  } else if (!req.body.hasOwnProperty("confirmPassword")) {
    res.status(400).send("confirmPassword field cannot be empty");
  } else if (req.body.newPassword != req.body.confirmPassword) {
    res
      .status(400)
      .send("New password and confirmPassword cannot be different");
  } else if (req.body.newPassword === req.body.password) {
    res.status(400).send("currentpassword and new password cannot be same");
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .changePassword(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

router.post("/updateProfile", function (req, res) {
  console.log(req.body);
  if (
    (!req.body.hasOwnProperty("mobileNumber") ||
      req.body.mobileNumber == null ||
      req.body.mobileNumber == "") &&
    (!req.body.hasOwnProperty("emailId") ||
      req.body.emailId == null ||
      req.body.emailId == "")
  ) {
    res.status(400).send("one of Mobile Number or Email id is mandatory");
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .updateProfile(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

router.post("/viewProfile", function (req, res) {
  console.log(req.body);
  if (
    (!req.body.hasOwnProperty("mobileNumber") ||
      req.body.mobileNumber == null ||
      req.body.mobileNumber == "") &&
    (!req.body.hasOwnProperty("emailId") ||
      req.body.emailId == null ||
      req.body.emailId == "")
  ) {
    res.status(400).send("one of Mobile Number or Email id is mandatory");
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .viewProfile(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

//Upload profile Image
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

async function medicalDetails(req, res) {
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

async function favouriteDoctor(req, res) {
  console.log("printAkash");
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
    // console.log("error", err);
    controller
      .favouriteDoctor(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
}
//For doctor
router.post("/login/doc", function (req, res) {
  console.log("Req is ", req.body);
  if (
    (!req.body.hasOwnProperty("mobile") ||
      req.body.mobile == null ||
      req.body.mobile == "") &&
    (!req.body.hasOwnProperty("emailId") ||
      req.body.emailId == null ||
      req.body.emailId == "")
  ) {
    res.status(400).send("one of Mobile Number or Email id is mandatory");
  } else if (
    !(req.body.hasOwnProperty("password") || req.body.hasOwnProperty("pin"))
  ) {
    res.status(400).send("Password or Pin is required");
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .loginDoc(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});

async function staffIsRegistredOrUnregistered(req, res) {
  try {
    let fail = false;
    const list = userAttributeList.staffRegistredAttributes;
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

    // if (
    //   req.body.hasOwnProperty("mobile") == false ||
    //   req.body.mobile == null ||
    //   req.body.mobile == ""
    // ) {
    //   res.status(400).send("bad request , mobile cannot be empty");
    // } else
    if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else {
      await controller
        .staffIsRegistredOrUnregistered(req.body)
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
//For staff
router.post("/login/staff", function (req, res) {
  if (
    !req.body.hasOwnProperty("mobileNumber") ||
    req.body.mobileNumber == null ||
    req.body.mobileNumber == ""
    //    &&
    // (!req.body.hasOwnProperty("emailId") ||
    //   req.body.emailId == null ||
    //   req.body.emailId == "")
  ) {
    res.status(400).send("Mobile number is required");
  } else if (
    !req.body.hasOwnProperty("pin") ||
    !req.body.hasOwnProperty("password")
  ) {
    res.status(400).send("Password or Pin is required");
  } else {
    // if(!validatePassword(req.body.password)){
    //     res.status(403).send("password is not valid")
    // }
    controller
      .loginStaff(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
});
router.post("/userDetails/addMedicalDetails", addMedicalDetails);
router.post("/userDetails/getMedicalDetails", medicalDetails);
router.post("/userDetails/favouriteDoctor", favouriteDoctor);
router.post("/staff/mobilecheck", staffIsRegistredOrUnregistered);

module.exports = router;
