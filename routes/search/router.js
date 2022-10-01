"use strict";
let router = require("express").Router();
const controller = require("./controller");
const searchAttributeList = require("./constants/searchAttributeList");

async function getSearchDetails(req, res) {
  try {
    if (
      req.body.hasOwnProperty("query") == false ||
      req.body.query == null ||
      req.body.query == ""
    ) {
      res.status(400).send("bad request, query cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageNo") == false ||
      req.body.pageNo == null
    ) {
      res.status(400).send("bad request, pageNo field is missing");
    } else if (
      req.body.hasOwnProperty("pageSize") == false ||
      req.body.pageSize == null ||
      req.body.pageSize == ""
    ) {
      res.status(400).send("bad request, pageSize field is missing");
    } else if (
      req.body.hasOwnProperty("didYouMean") == false ||
      typeof req.body.didYouMean !== "boolean"
    ) {
      res.status(400).send("bad request, didYouMean field is missing");
    } else if (
      req.body.hasOwnProperty("applyLTR") == false ||
      typeof req.body.applyLTR !== "boolean"
    ) {
      res.status(400).send("bad request, applyLTR field is missing");
    } else if (
      req.body.hasOwnProperty("highlight") == false ||
      typeof req.body.highlight !== "boolean"
    ) {
      res.status(400).send("bad request, highlight field is missing");
    } else if (
      req.body.hasOwnProperty("visibleFilters") == false ||
      req.body.visibleFilters == null ||
      req.body.visibleFilters == ""
    ) {
      res.status(400).send("bad request, visibleFilters field is missing");
    } else if (
      req.body.hasOwnProperty("isStandAlone") == false ||
      typeof req.body.isStandAlone !== "boolean"
    ) {
      res.status(400).send("bad request, isStandAlone field is missing");
    } else if (req.body.hasOwnProperty("filters") == false) {
      res.status(400).send("bad request, filters field is missing");
    } else if (req.body.hasOwnProperty("sort") == false) {
      res.status(400).send("bad request, sort field is missing");
    } else {
      //VisibleFilter
      let visibleFilter = req.body.visibleFilters; //["specialization" , "languages"]
      const filters = searchAttributeList.searchFilterAttributes;
      for (let i = 0; i < visibleFilter.length; i++) {
        if (!filters.includes(Object.keys(visibleFilter[i])[0])) {
          res
            .status(400)
            .send(
              "bad request, filter cannot be done based on the given parameter"
            );
          return;
        }
      }

      //sorting
      let sortBy = req.body.sort;

      for (let i = 0; i < sortBy.length; i++) {
        if (!sortList.includes(Object.keys(sortBy[i])[i])) {
          res
            .status(400)
            .send(
              "bad request, sorting cannot be done based on the given parameter"
            );
          return;
        }
      }
      await controller
        .getSearchDetails(req.body)
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

router.post("/doctorSearch", getSearchDetails);

module.exports = router;
