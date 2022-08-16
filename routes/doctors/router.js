const router = require("express").Router();
const controller = require("./controller");
const docAttributeList = require("./constants/docAttributeList");
const _ = require("underscore");
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
   // res.status(400).send("bad request , role cannot be empty");
  }else if (
    req.body.hasOwnProperty("fields") == false ||
    req.body.role == null ||
    req.body.role == ""
  ) {
    //res.status(400).send("bad request , fields cannot be empty");
  }
  else {
    doctorId = req.body.id;
    role = req.body.role;
    fieldsToFetch = req.body.fields;
    console.log("Fields to fetch 1",fieldsToFetch)
  }
  console.log("Fields to fetch ",fieldsToFetch)
  controller
    .getProfileDetailsController(doctorId, role, fieldsToFetch)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
}

//update Profile details
function updateProfileDetails(req, res) {
  let id 
  let role
  let obj
  const list = docAttributeList();
  Object.keys(req.body).forEach(key => {
    if (!list.includes(key)) { 
      res.status(400).send("bad request , unknown attribute found in request");
    }
  })
  if (req.body.hasOwnProperty("id") == false || req.body.id == null || req.body.id == "") {
    res.status(400).send("bad request , id cannot be empty");
  } else if (req.body.hasOwnProperty("role") == false || req.body.role == null || req.body.role == "") {
    res.status(400).send("bad request , role cannot be empty");
  } else { 
    id = req.body.id;
    role = req.body.role;
    obj = req.body;
    obj = _.omit(obj, "id","role");
  }
  console.log("inside update router")

  controller
    .updateProfileDetailsController(id, role ,obj)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
  
}

//Upload profile Image
function uploadProfileImage(req, res) { 
  // console.log(req.body)
  const file = req.files.profilePic
  cloudinary.uploader.upload(file.tempFilePath, (err, result) => { 
    // console.log(result)
    if (err) { 
      res.status(500).send("Upload failed !");
    }
    req.body.docImageUrl = result.url
    // console.log(req.body)
    updateProfileDetails(req, res)
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

router.post("/doctorDetail", getProfileDetails);
router.post("/doctorDetail/imageUpload", uploadProfileImage);
router.post("/create", createNewDoctorAccount);
router.put("/doctorDetail/updateDetails", updateProfileDetails);
module.exports = router;
