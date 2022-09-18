const router = require("express").Router();
const controller = require("./controller");
const docAttributeList = require("./constants/docAttributeList");
const _ = require("underscore");
const { isEqual } = require("underscore");
const e = require("express");
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'sam7566', 
  api_key: '697775673339567', 
  api_secret: 'eB8FLNOwCSk98pZs7x2dkIBR324' 
});

//get Profile details (all & specific Field search)
function getProfileDetails(req, res) {
 // req.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
 
  let doctorId;
  let fieldsToFetch;
  let role;
  console.log("hello doctor router id",req.body);
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
  }else if (
    req.body.hasOwnProperty("fields") == false ||
    req.body.role == null ||
    req.body.role == ""
  ) {
    res.status(400).send("bad request , fields cannot be empty");
  }
  else {
    doctorId = req.body.id;
    role = req.body.role;
    fieldsToFetch = req.body.fields;
    console.log("Fields to fetch 1", fieldsToFetch)
    console.log("Fields to fetch ",fieldsToFetch)
    controller
    .getProfileDetailsController(doctorId, role, fieldsToFetch)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
  }
 
  
}

//update Profile details
function updateProfileDetails(req, res) {
  let id 
  let role
  let obj
  let failDueToChange=false
  const list = docAttributeList.profileAttributes;

  Object.keys(req.body).forEach(key => {
    if (!list.includes(key)) { 
      res.status(400).send("bad request , unknown attribute found in request");
      failDueToChange=true
      // return
    }
   
  })
  if(failDueToChange){
    return
  }
   if (req.body.hasOwnProperty("id") == false || req.body.id == null || req.body.id == "") {
    res.status(400).send("bad request , id cannot be empty");
   
  } else if (req.body.hasOwnProperty("role") == false || req.body.role == null || req.body.role == "") {
    res.status(400).send("bad request , role cannot be empty");
  }
  
  
  else { 
    id = req.body.id;
    role = req.body.role;
    obj = req.body;
    obj = _.omit(obj, "id", "role");
    console.log("inside update router")
  controller
    .updateProfileDetailsController(id, role ,obj)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
  }

}

//Upload profile Image
function uploadProfileImage(req, res) { 
  // console.log(req.body)
  const file = req.files.profilePic
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => { 
    // console.log(result)
    if (err) {
      res.status(500).send("Upload failed !");
    } else { 
      req.body.docImageUrl = result.url
      // console.log(req.body)
      updateProfileDetails(req, res)
    }
    
  })
}

//Create new Doctor Account
function createNewDoctorAccount(req, res) {
  //console.log("the body is ",req.body)
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
  } else if (req.body.hasOwnProperty("isPersonAllowed") == false) {
    res.status(400).send("bad request, isPersonAllowed field is missing");
  } else if (req.body.hasOwnProperty("isVideoAllowed") == false) {
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
    controller
      .createNewDoctorAccount(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
}



function createDoctorReviews(req, res) {
  
  let role;
  let fail = false;
   const list = docAttributeList.userReviewsAttributes;
  Object.keys(req.body).forEach(key => {
    if (!list.includes(key)) { 
      res.status(400).send("bad request , unknown attribute found in request");
      fail=true
    }
  })
  if (fail)
    return;
  
  if (req.body.hasOwnProperty("doctorId") == false || req.body.doctorId == null || req.body.doctorId == "") {
    res.status(400).send("bad request , doctorId cannot be empty");
  } else if (req.body.hasOwnProperty("role") == false || req.body.role == null || req.body.role == "") {
    res.status(400).send("bad request , role cannot be empty");
  }else if (req.body.hasOwnProperty("reviewRating") == false || req.body.reviewRating == null || req.body.reviewRating == "") {
    res.status(400).send("bad request , reviewRating cannot be empty");
  }else if (req.body.hasOwnProperty("reviewMessage") == false || req.body.reviewMessage == null || req.body.reviewMessage == "") {
    res.status(400).send("bad request , reviewMessage cannot be empty");
  }else if (req.body.hasOwnProperty("reviewDate") == false || req.body.reviewDate == null || req.body.reviewDate == "") {
    res.status(400).send("bad request , reviewDate cannot be empty");
  }else if (req.body.hasOwnProperty("userId") == false || req.body.userId == null || req.body.userId == "") {
    res.status(400).send("bad request , userId cannot be empty");
  }else if (req.body.hasOwnProperty("userName") == false || req.body.userName == null || req.body.userName == "") {
    res.status(400).send("bad request , userName cannot be empty");
  }else if (req.body.hasOwnProperty("isVerifiedUser") == false || req.body.isVerifiedUser == null || req.body.isVerifiedUser == "") {
    res.status(400).send("bad request , isVerifiedUser cannot be empty");
  }else if (req.body.hasOwnProperty("reviewlastEditedOn") == false || req.body.reviewlastEditedOn == null || req.body.reviewlastEditedOn == "") {
    res.status(400).send("bad request , reviewlastEditedOn cannot be empty");
  }else if (req.body.hasOwnProperty("userScheduleId") == false || req.body.userScheduleId == null || req.body.userScheduleId == "") {
    res.status(400).send("bad request , userScheduleId cannot be empty");
  }else if (req.body.hasOwnProperty("patientEducationRating") == false || req.body.patientEducationRating == null || req.body.patientEducationRating == "") {
    res.status(400).send("bad request , patientEducationRating cannot be empty");
  }else if (req.body.hasOwnProperty("staffCourteousnessRating") == false || req.body.staffCourteousnessRating == null || req.body.staffCourteousnessRating == "") {
    res.status(400).send("bad request , staffCourteousnessRating cannot be empty");
  }else if (req.body.hasOwnProperty("bedsideMannerismRating") == false || req.body.bedsideMannerismRating == null || req.body.bedsideMannerismRating == "") {
    res.status(400).send("bad request , bedsideMannerismRating cannot be empty");
  }else if (req.body.hasOwnProperty("friendlinessAndWaitTimeRating") == false || req.body.friendlinessAndWaitTimeRating == null || req.body.friendlinessAndWaitTimeRating == "") {
    res.status(400).send("bad request , friendlinessAndWaitTimeRating cannot be empty");
  }else if (req.body.hasOwnProperty("accurateDiagnosisRating") == false || req.body.accurateDiagnosisRating == null || req.body.accurateDiagnosisRating == "") {
    res.status(400).send("bad request , accurateDiagnosisRating cannot be empty");
  }
  else {
    role = req.body.role;
    obj = req.body;
    obj = _.omit(obj, "role");
     controller
      .createNewReview(obj ,role)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
   }
 
}

function updateReviewDetails(req, res) {
  const id = req.body.id
  req.body = _.omit(req.body, "id")
  let role
  let obj
  let fail = false;
  const list = docAttributeList.userReviewsAttributes;
  Object.keys(req.body).forEach(key => {
    if (!list.includes(key)) { 
      res.status(400).send("bad request , unknown attribute found in request");
      fail=true
    }
  })
  if (fail)
    return;
  
  if (req.body.hasOwnProperty("doctorId") == false || req.body.doctorId == null || req.body.doctorId == "") {
    res.status(400).send("bad request , doctorId cannot be empty");
  } else if (req.body.hasOwnProperty("role") == false || req.body.role == null || req.body.role == "") {
    res.status(400).send("bad request , role cannot be empty");
  }else if (req.body.hasOwnProperty("reviewRating") == false || req.body.reviewRating == null || req.body.reviewRating == "") {
    res.status(400).send("bad request , reviewRating cannot be empty");
  }else if (req.body.hasOwnProperty("reviewMessage") == false || req.body.reviewMessage == null || req.body.reviewMessage == "") {
    res.status(400).send("bad request , reviewMessage cannot be empty");
  }else if (req.body.hasOwnProperty("reviewDate") == false || req.body.reviewDate == null || req.body.reviewDate == "") {
    res.status(400).send("bad request , reviewDate cannot be empty");
  }else if (req.body.hasOwnProperty("userId") == false || req.body.userId == null || req.body.userId == "") {
    res.status(400).send("bad request , userId cannot be empty");
  }else if (req.body.hasOwnProperty("userName") == false || req.body.userName == null || req.body.userName == "") {
    res.status(400).send("bad request , userName cannot be empty");
  }else if (req.body.hasOwnProperty("isVerifiedUser") == false || req.body.isVerifiedUser == null || req.body.isVerifiedUser == "") {
    res.status(400).send("bad request , isVerifiedUser cannot be empty");
  }else if (req.body.hasOwnProperty("reviewlastEditedOn") == false || req.body.reviewlastEditedOn == null || req.body.reviewlastEditedOn == "") {
    res.status(400).send("bad request , reviewlastEditedOn cannot be empty");
  }else if (req.body.hasOwnProperty("userScheduleId") == false || req.body.userScheduleId == null || req.body.userScheduleId == "") {
    res.status(400).send("bad request , userScheduleId cannot be empty");
  }else if (req.body.hasOwnProperty("patientEducationRating") == false || req.body.patientEducationRating == null || req.body.patientEducationRating == "") {
    res.status(400).send("bad request , patientEducationRating cannot be empty");
  }else if (req.body.hasOwnProperty("staffCourteousnessRating") == false || req.body.staffCourteousnessRating == null || req.body.staffCourteousnessRating == "") {
    res.status(400).send("bad request , staffCourteousnessRating cannot be empty");
  }else if (req.body.hasOwnProperty("bedsideMannerismRating") == false || req.body.bedsideMannerismRating == null || req.body.bedsideMannerismRating == "") {
    res.status(400).send("bad request , bedsideMannerismRating cannot be empty");
  }else if (req.body.hasOwnProperty("friendlinessAndWaitTimeRating") == false || req.body.friendlinessAndWaitTimeRating == null || req.body.friendlinessAndWaitTimeRating == "") {
    res.status(400).send("bad request , friendlinessAndWaitTimeRating cannot be empty");
  }else if (req.body.hasOwnProperty("accurateDiagnosisRating") == false || req.body.accurateDiagnosisRating == null || req.body.accurateDiagnosisRating == "") {
    res.status(400).send("bad request , accurateDiagnosisRating cannot be empty");
  } else { 
    role = req.body.role;
    obj = req.body;
    obj = _.omit(obj, "role");
  controller
    .updateProfileDetailsController(id, role ,obj)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
  }

}

function getDoctorReviewsByUserIdOrDoctorId(req, res) {
  let fail = false;
  const list = docAttributeList.getRequestReviewAttributes;
  Object.keys(req.body).forEach(key => {
    if (!list.includes(key)) { 
      res.status(400).send("bad request , unknown attribute found in request");
      fail=true
    }
  })
  if (fail)
    return;
  
  let sortBy = Object.keys(req.body.sort);

  const sortList = docAttributeList.sortListForReview;
  for (i = 0; i < sortBy.length; i++) {
    if (!sortList.includes(sortBy[i])) {
      res
        .status(400)
        .send(
          "bad request, sorting cannot be done based on the given parameter"
      );
      return
    }
  }
  
  if (req.body.hasOwnProperty("doctorId") == false && req.body.hasOwnProperty("userId") == false) { 
    res.status(400).send("bad request , atleast one Field out of doctorID or userID is required");
  }else if (req.body.hasOwnProperty("doctorId") && req.body.hasOwnProperty("userId") && (req.body.doctorId == null || req.body.doctorId == "" || req.body.userId == null || req.body.userId == "")) {
    res.status(400).send("bad request , doctorId and userID cannot be empty");
  } else if (req.body.hasOwnProperty("doctorId") && (req.body.doctorId == null || req.body.doctorId == "")) {
    res.status(400).send("bad request , doctorId cannot be empty");
  } else if (req.body.hasOwnProperty("userId") && (req.body.userId == null || req.body.userId == "")) {
    res.status(400).send("bad request , userId cannot be empty");
  } else if (req.body.hasOwnProperty("role") == false || req.body.role == null || req.body.role == "") {
    res.status(400).send("bad request , role cannot be empty");
  } else if (req.body.hasOwnProperty("pageSize") == false || req.body.pageSize == null || req.body.pageSize == "") {
    res.status(400).send("bad request , pageSize cannot be empty");
  } else if (req.body.hasOwnProperty("pageNo") == false || req.body.pageNo == null) {
    res.status(400).send("bad request , pageNo cannot be empty");
  } else if (req.body.hasOwnProperty("sort") == false) {
    res.status(400).send("bad request , sort field required");
  } else {
    
     console.log("in router")
    controller
     .getReviewsDetails(req.body)
     .then((data) => res.send(data))
     .catch((err) => res.status(err.statuscode).send(err));
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
