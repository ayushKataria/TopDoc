"use strict";
const adsAttributeList = require("./constants/adsAttributeList");
const _ = require("underscore");
const docController = require("../doctors/controller");
const controller = require("./controller");
let router = require("express").Router();

async function updateDoctorAds(req, res) {
  try {
    let fail = false;
    const list = adsAttributeList.adsAttributes;
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
      req.body.hasOwnProperty("adId") == false ||
      req.body.adId == null ||
      req.body.adId == ""
    ) {
      res.status(400).send("bad request , adId cannot be empty");
    } else {
      let adId = req.body.adId;
      let role = "ads";
      let obj = req.body;
      obj = _.omit(obj, "id");
      await docController
        .updateProfileDetailsController(adId, role, obj)
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

async function createDoctorAds(req, res) {
  try {
    let fail = false;
    const list = adsAttributeList.adsAttributes;
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
      req.body.hasOwnProperty("banner") == false ||
      req.body.banner == null ||
      req.body.banner == ""
    ) {
      res.status(400).send("bad request , banner cannot be empty");
    } else if (
      req.body.hasOwnProperty("templateId") == false ||
      req.body.templateId == null ||
      req.body.templateId == ""
    ) {
      res.status(400).send("bad request , templateId cannot be empty");
    } else if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("submittedBy") == false ||
      req.body.submittedBy == null ||
      req.body.submittedBy == ""
    ) {
      res.status(400).send("bad request , submittedBy cannot be empty");
    } else if (
      req.body.hasOwnProperty("targetDistrict") == false ||
      req.body.targetDistrict == null ||
      req.body.targetDistrict == ""
    ) {
      res.status(400).send("bad request , targetDistrict cannot be empty");
    } else if (
      req.body.hasOwnProperty("targetState") == false ||
      req.body.targetState == null ||
      req.body.targetState == ""
    ) {
      res.status(400).send("bad request , targetState cannot be empty");
    } else if (
      req.body.hasOwnProperty("duration") == false ||
      req.body.duration == null ||
      req.body.duration == ""
    ) {
      res.status(400).send("bad request , duration cannot be empty");
    } else if (
      req.body.hasOwnProperty("approvedBy") == false ||
      req.body.approvedBy == null ||
      req.body.approvedBy == ""
    ) {
      res.status(400).send("bad request , approvedBy field required");
    } else if (
      req.body.hasOwnProperty("startDate") == false ||
      req.body.startDate == null ||
      req.body.startDate == ""
    ) {
      res.status(400).send("bad request , startDate field required");
    } else if (
      req.body.hasOwnProperty("status") == false ||
      req.body.status == null ||
      req.body.status == ""
    ) {
      res.status(400).send("bad request , status field required");
    } else if (
      req.body.hasOwnProperty("endDate") == false ||
      req.body.endDate == null ||
      req.body.endDate == ""
    ) {
      res.status(400).send("bad request , sort field required");
    } else if (
      req.body.hasOwnProperty("billing") == false ||
      req.body.billing == null ||
      req.body.billing == ""
    ) {
      res.status(400).send("bad request , billing field required");
    } else if (
      req.body.hasOwnProperty("clicks") == false ||
      req.body.clicks == null ||
      req.body.clicks == ""
    ) {
      res.status(400).send("bad request , clicks field required");
    } else if (
      req.body.hasOwnProperty("appearances") == false ||
      req.body.appearances == null ||
      req.body.appearances == ""
    ) {
      res.status(400).send("bad request , appearances field required");
    } else {
      console.log("in router");
      await controller
        .createNewDoctorAds(req.body)
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

async function getDoctorAdsByDoctorId(req, res) {
  try {
    let fail = false;
    const list = adsAttributeList.adsAttributes;
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
    const sortList = adsAttributeList.adsSortList;
    for (let i = 0; i < sortBy.length; i++) {
      if (!sortList.includes(sortBy[i])) {
        res
          .status(400)
          .send(
            "bad request, sorting cannot be done based on the given parameter"
          );
        fail = true;
      }
    }
    if (fail) return;
    let filterBy = req.body.filters;
    const filterList = adsAttributeList.adsFilterList;
    for (let i = 0; i < filterBy.length; i++) {
      if (!filterList.includes(Object.keys(filterBy[i])[i])) {
        res
          .status(400)
          .send(
            "bad request, filtering cannot be done based on the given parameter"
          );
        fail = true;
      }
    }
    if (fail) return;
    if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request ,  doctorID cannot be empty");
    } else if (
      req.body.hasOwnProperty("doctorId") &&
      req.body.hasOwnProperty("adId")
    ) {
      res.status(400).send("bad request , Only doctorId needed");
    } else if (
      req.body.hasOwnProperty("pageNo") == false ||
      req.body.pageNo == null
    ) {
      res.status(400).send("bad request , pageNo cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageSize") == false ||
      req.body.pageSize == null ||
      req.body.pageSize == ""
    ) {
      res.status(400).send("bad request , pageSize cannot be empty");
    } else if (req.body.hasOwnProperty("sort") == false) {
      res.status(400).send("bad request , sort field missing");
    } else if (req.body.hasOwnProperty("filters") == false) {
      res.status(400).send("bad request , filters field missing");
    } else {
      console.log("in router");
      await controller
        .getAdsDetailsByDoctorId(req.body)
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

async function getDoctorAdsToShowUser(req, res) {
  try {
    let fail = false;
    const list = adsAttributeList.adsShowToUserAttributes;
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
      req.body.hasOwnProperty("userId") == false ||
      req.body.userId == null ||
      req.body.userId == ""
    ) {
      res.status(400).send("bad request ,  userId cannot be empty");
    } else if (
      req.body.hasOwnProperty("district") == false ||
      req.body.district == null ||
      req.body.district == ""
    ) {
      res.status(400).send("bad request , district cannot be empty");
    } else if (
      req.body.hasOwnProperty("state") == false ||
      req.body.state == null ||
      req.body.state == ""
    ) {
      res.status(400).send("bad request , state cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageNo") == false ||
      req.body.pageNo == null
    ) {
      res.status(400).send("bad request , pageNo cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageSize") == false ||
      req.body.pageSize == null ||
      req.body.pageSize == ""
    ) {
      res.status(400).send("bad request , pageSize cannot be empty");
    } else {
      console.log("in router");
      await controller
        .getAdsToShowToUserFromUserId(req.body)
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

async function getUserNumberByDistrict(req, res) {
  try {
    let fail = false;
    const list = ["districts"];
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
      req.body.hasOwnProperty("districts") == false ||
      req.body.districts == null ||
      req.body.districts == ""
    ) {
      res.status(400).send("bad request ,  districts cannot be empty");
    } else {
      console.log("in router");
      await controller
        .getUserCountByDistrict(req.body)
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

router.post("/updateAdDetails", updateDoctorAds);
router.post("/create", createDoctorAds);
router.post("/getAdsByDoctorId", getDoctorAdsByDoctorId);
router.post("/showAdsToUser", getDoctorAdsToShowUser);
router.post("/getUsersInDistricts", getUserNumberByDistrict);

module.exports = router;
