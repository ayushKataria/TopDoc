"use strict";
const router = require("express").Router();
const controller = require("./controller");
const docAttributeList = require("./constants/docAttributeList");
const userAttributeList = require("../users/constants/userAttributeList");
const _ = require("underscore");
const cloudinary = require("cloudinary").v2;

//for profile photos
cloudinary.config({
  cloud_name: "sam7566",
  api_key: "697775673339567",
  api_secret: "eB8FLNOwCSk98pZs7x2dkIBR324",
});

//get Profile details (all & specific Field search)
async function getProfileDetails(req, res) {
  // req.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  try {
    let doctorId;
    let fieldsToFetch;
    let role;
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
      req.body.hasOwnProperty("fields") == false ||
      req.body.fields == null ||
      req.body.fields == ""
    ) {
      res.status(400).send("bad request , fields cannot be empty");
    } else if (req.body.id.length > 1) {
      getArrayProfileDetails(req.body.id, req.body.role, req.body.fields)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.statuscode).send(err));
    } else {
      doctorId = req.body.id[0];
      role = req.body.role;
      fieldsToFetch = req.body.fields;
      await controller
        .getProfileDetailsController(doctorId, role, fieldsToFetch)
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

async function getArrayProfileDetails(profileArray, role, fieldsToFetch) {
  try {
    let profiles = {};
    let result = [];
    profiles.hits = profileArray.length;
    for (let i = 0; i < profileArray.length; i++) {
      let data = await controller.getProfileDetailsController(
        profileArray[i],
        role,
        fieldsToFetch
      );
      result[i] = data.results[0];
    }
    profiles.results = result.map((e) => {
      return e;
    });
    return profiles;
  } catch (error) {
    throw {
      statuscode: 404,
      message: "No such document exist",
    };
  }
}
//update Profile details
async function updateProfileDetails(req, res) {
  try {
    let id;
    let role;
    let obj;
    let fail;
    let list;
    if (req.body.role == "doctor") {
      list = docAttributeList.doctorUpdateAttributes;
    } else if (req.body.role == "user") {
      list = userAttributeList.userUpdateAttributes;
    }
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        fail = true;
      }
    });
    if (fail) {
      res.status(400).send("bad request , unknown attribute found in request");
      return;
    }

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
      id = req.body.id;
      role = req.body.role;
      obj = req.body;
      obj = _.omit(obj, "id", "role");
      await controller
        .updateProfileDetailsController(id, role, obj)
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

//Upload profile Image
function uploadProfileImage(req, res) {
  const file = req.files.profilePic;
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
    if (err) {
      res.status(500).send("Upload failed !");
    } else {
      req.body.docImageUrl = result.url;
      updateProfileDetails(req, res);
    }
  });
}

//Create new Doctor Account
async function createNewDoctorAccount(req, res) {
  try {
    if (req.body.hasOwnProperty("address") == false) {
      res.status(400).send("bad request, address field is missing");
    } else if (req.body.hasOwnProperty("ailmentsTreated") == false) {
      res.status(400).send("bad request, ailmentsTreated field is missing");
    } else if (req.body.hasOwnProperty("averageRating") == false) {
      res.status(400).send("bad request, averageRating field is missing");
    } else if (req.body.hasOwnProperty("city") == false) {
      res.status(400).send("bad request, city field is missing");
    } else if (req.body.hasOwnProperty("country") == false) {
      res.status(400).send("bad request, country field is missing");
    } else if (req.body.hasOwnProperty("designation") == false) {
      res.status(400).send("bad request, designation field is missing");
    } else if (req.body.hasOwnProperty("education") == false) {
      res.status(400).send("bad request, education field is missing");
    } else if (req.body.hasOwnProperty("email") == false) {
      res.status(400).send("bad request, email field is missing");
    } else if (req.body.hasOwnProperty("experience") == false) {
      res.status(400).send("bad request, experience field is missing");
    } else if (req.body.hasOwnProperty("firstName") == false) {
      res.status(400).send("bad request, firstName field is missing");
    } else if (req.body.hasOwnProperty("gender") == false) {
      res.status(400).send("bad request, gender field is missing");
    } else if (req.body.hasOwnProperty("hospital") == false) {
      res.status(400).send("bad request, hospital field is missing");
    } else if (
      req.body.hasOwnProperty("isPersonAllowed") == false ||
      typeof req.body.isPersonAllowed !== "boolean"
    ) {
      res.status(400).send("bad request, isPersonAllowed field is missing");
    } else if (
      req.body.hasOwnProperty("isVideoAllowed") == false ||
      typeof req.body.isVideoAllowed !== "boolean"
    ) {
      res.status(400).send("bad request, isVideoAllowed field is missing");
    } else if (req.body.hasOwnProperty("landmark") == false) {
      res.status(400).send("bad request, landmark field is missing");
    } else if (req.body.hasOwnProperty("languages") == false) {
      res.status(400).send("bad request, languages field is missing");
    } else if (req.body.hasOwnProperty("lastName") == false) {
      res.status(400).send("bad request, lastName field is missing");
    } else if (req.body.hasOwnProperty("licenses") == false) {
      res.status(400).send("bad request, licenses field is missing");
    } else if (req.body.hasOwnProperty("locality") == false) {
      res.status(400).send("bad request, locality field is missing");
    } else if (req.body.hasOwnProperty("location") == false) {
      res.status(400).send("bad request, location field is missing");
    } else if (req.body.hasOwnProperty("name") == false) {
      res.status(400).send("bad request, name field is missing");
    } else if (req.body.hasOwnProperty("phone") == false) {
      res.status(400).send("bad request, phone field is missing");
    } else if (req.body.hasOwnProperty("schedule") == false) {
      res.status(400).send("bad request, schedule field is missing");
    } else if (req.body.hasOwnProperty("specialization") == false) {
      res.status(400).send("bad request, specialization field is missing");
    } else if (req.body.hasOwnProperty("state") == false) {
      res.status(400).send("bad request, state field is missing");
    } else if (req.body.hasOwnProperty("yearsOfExperience") == false) {
      res.status(400).send("bad request, yearsOfExperience field is missing");
    } else {
      await controller
        .createNewDoctorAccount(req.body)
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

//Creating new Review for a Doctor
async function createDoctorReviews(req, res) {
  try {
    let role;
    let fail = false;
    const list = docAttributeList.userReviewsAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewRating") == false ||
      req.body.reviewRating == null ||
      req.body.reviewRating == ""
    ) {
      res.status(400).send("bad request , reviewRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewMessage") == false ||
      req.body.reviewMessage == null ||
      req.body.reviewMessage == ""
    ) {
      res.status(400).send("bad request , reviewMessage cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewDate") == false ||
      req.body.reviewDate == null ||
      req.body.reviewDate == ""
    ) {
      res.status(400).send("bad request , reviewDate cannot be empty");
    } else if (
      req.body.hasOwnProperty("userId") == false ||
      req.body.userId == null ||
      req.body.userId == ""
    ) {
      res.status(400).send("bad request , userId cannot be empty");
    } else if (
      req.body.hasOwnProperty("userName") == false ||
      req.body.userName == null ||
      req.body.userName == ""
    ) {
      res.status(400).send("bad request , userName cannot be empty");
    } else if (
      req.body.hasOwnProperty("isVerifiedUser") == false ||
      typeof req.body.isVerifiedUser !== "boolean"
    ) {
      res.status(400).send("bad request , isVerifiedUser cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewlastEditedOn") == false ||
      req.body.reviewlastEditedOn == null ||
      req.body.reviewlastEditedOn == ""
    ) {
      res.status(400).send("bad request , reviewlastEditedOn cannot be empty");
    } else if (
      req.body.hasOwnProperty("userScheduleId") == false ||
      req.body.userScheduleId == null ||
      req.body.userScheduleId == ""
    ) {
      res.status(400).send("bad request , userScheduleId cannot be empty");
    } else if (
      req.body.hasOwnProperty("patientEducationRating") == false ||
      req.body.patientEducationRating == null ||
      req.body.patientEducationRating == ""
    ) {
      res
        .status(400)
        .send("bad request , patientEducationRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("staffCourteousnessRating") == false ||
      req.body.staffCourteousnessRating == null ||
      req.body.staffCourteousnessRating == ""
    ) {
      res
        .status(400)
        .send("bad request , staffCourteousnessRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("bedsideMannerismRating") == false ||
      req.body.bedsideMannerismRating == null ||
      req.body.bedsideMannerismRating == ""
    ) {
      res
        .status(400)
        .send("bad request , bedsideMannerismRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("friendlinessAndWaitTimeRating") == false ||
      req.body.friendlinessAndWaitTimeRating == null ||
      req.body.friendlinessAndWaitTimeRating == ""
    ) {
      res
        .status(400)
        .send("bad request , friendlinessAndWaitTimeRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("accurateDiagnosisRating") == false ||
      req.body.accurateDiagnosisRating == null ||
      req.body.accurateDiagnosisRating == ""
    ) {
      res
        .status(400)
        .send("bad request , accurateDiagnosisRating cannot be empty");
    } else {
      role = req.body.role;
      let obj = req.body;
      obj = _.omit(obj, "role");
      await controller
        .createNewReview(obj, role)
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

//update a Review
async function updateReviewDetails(req, res) {
  try {
    const id = req.body.id;
    req.body = _.omit(req.body, "id");
    let role;
    let obj;
    let fail = false;
    const list = docAttributeList.userReviewsAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewRating") == false ||
      req.body.reviewRating == null ||
      req.body.reviewRating == ""
    ) {
      res.status(400).send("bad request , reviewRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewMessage") == false ||
      req.body.reviewMessage == null ||
      req.body.reviewMessage == ""
    ) {
      res.status(400).send("bad request , reviewMessage cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewDate") == false ||
      req.body.reviewDate == null ||
      req.body.reviewDate == ""
    ) {
      res.status(400).send("bad request , reviewDate cannot be empty");
    } else if (
      req.body.hasOwnProperty("userId") == false ||
      req.body.userId == null ||
      req.body.userId == ""
    ) {
      res.status(400).send("bad request , userId cannot be empty");
    } else if (
      req.body.hasOwnProperty("userName") == false ||
      req.body.userName == null ||
      req.body.userName == ""
    ) {
      res.status(400).send("bad request , userName cannot be empty");
    } else if (
      req.body.hasOwnProperty("isVerifiedUser") == false ||
      typeof req.body.isVerifiedUser !== "boolean"
    ) {
      res.status(400).send("bad request , isVerifiedUser cannot be empty");
    } else if (
      req.body.hasOwnProperty("reviewlastEditedOn") == false ||
      req.body.reviewlastEditedOn == null ||
      req.body.reviewlastEditedOn == ""
    ) {
      res.status(400).send("bad request , reviewlastEditedOn cannot be empty");
    } else if (
      req.body.hasOwnProperty("userScheduleId") == false ||
      req.body.userScheduleId == null ||
      req.body.userScheduleId == ""
    ) {
      res.status(400).send("bad request , userScheduleId cannot be empty");
    } else if (
      req.body.hasOwnProperty("patientEducationRating") == false ||
      req.body.patientEducationRating == null ||
      req.body.patientEducationRating == ""
    ) {
      res
        .status(400)
        .send("bad request , patientEducationRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("staffCourteousnessRating") == false ||
      req.body.staffCourteousnessRating == null ||
      req.body.staffCourteousnessRating == ""
    ) {
      res
        .status(400)
        .send("bad request , staffCourteousnessRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("bedsideMannerismRating") == false ||
      req.body.bedsideMannerismRating == null ||
      req.body.bedsideMannerismRating == ""
    ) {
      res
        .status(400)
        .send("bad request , bedsideMannerismRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("friendlinessAndWaitTimeRating") == false ||
      req.body.friendlinessAndWaitTimeRating == null ||
      req.body.friendlinessAndWaitTimeRating == ""
    ) {
      res
        .status(400)
        .send("bad request , friendlinessAndWaitTimeRating cannot be empty");
    } else if (
      req.body.hasOwnProperty("accurateDiagnosisRating") == false ||
      req.body.accurateDiagnosisRating == null ||
      req.body.accurateDiagnosisRating == ""
    ) {
      res
        .status(400)
        .send("bad request , accurateDiagnosisRating cannot be empty");
    } else {
      role = req.body.role;
      obj = req.body;
      obj = _.omit(obj, "role");
      await controller
        .updateProfileDetailsController(id, role, obj)
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

//Fetch Reviews using UserID or DoctorID or Both
async function getDoctorReviewsByUserIdOrDoctorId(req, res) {
  try {
    let fail = false;
    const list = docAttributeList.getRequestReviewAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    let sortBy = Object.keys(req.body.sort);

    const sortList = docAttributeList.sortListForReview;
    for (let i = 0; i < sortBy.length; i++) {
      if (!sortList.includes(sortBy[i])) {
        res
          .status(400)
          .send(
            "bad request, sorting cannot be done based on the given parameter"
          );
        return;
      }
    }

    if (
      req.body.hasOwnProperty("doctorId") == false &&
      req.body.hasOwnProperty("userId") == false
    ) {
      res
        .status(400)
        .send(
          "bad request , atleast one Field out of doctorID or userID is required"
        );
    } else if (
      req.body.hasOwnProperty("doctorId") &&
      req.body.hasOwnProperty("userId") &&
      (req.body.doctorId == null ||
        req.body.doctorId == "" ||
        req.body.userId == null ||
        req.body.userId == "")
    ) {
      res.status(400).send("bad request , doctorId and userID cannot be empty");
    } else if (
      req.body.hasOwnProperty("doctorId") &&
      (req.body.doctorId == null || req.body.doctorId == "")
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("userId") &&
      (req.body.userId == null || req.body.userId == "")
    ) {
      res.status(400).send("bad request , userId cannot be empty");
    } else if (
      req.body.hasOwnProperty("role") == false ||
      req.body.role == null ||
      req.body.role == ""
    ) {
      res.status(400).send("bad request , role cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageSize") == false ||
      req.body.pageSize == null ||
      req.body.pageSize == ""
    ) {
      res.status(400).send("bad request , pageSize cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageNo") == false ||
      req.body.pageNo == null
    ) {
      res.status(400).send("bad request , pageNo cannot be empty");
    } else if (req.body.hasOwnProperty("sort") == false) {
      res.status(400).send("bad request , sort field required");
    } else {
      console.log("in router");
      await controller
        .getReviewsDetails(req.body)
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

router.post("/doctorDetail", getProfileDetails);
router.post("/doctorDetail/imageUpload", uploadProfileImage);
router.post("/create", createNewDoctorAccount);
router.put("/updateDetails", updateProfileDetails);
router.post("/doctorReviews/updateDetails", updateReviewDetails);
router.post("/doctorReviews/create", createDoctorReviews);
router.post("/doctorReviews", getDoctorReviewsByUserIdOrDoctorId);
module.exports = router;
