let router = require("express").Router();
const controller = require("./controller");

function getSearchDetails(req, res) {
  console.log("chal de bhai");
  // console.log("req. body ", req.body);
  pageSize =10;
  pageNo=0;
  didYouMean= false;
  applyLTR=false;
  highlight=false;
  isStandAlone = false
  if (
    req.body.hasOwnProperty("query") == false ||
    req.body.query == null ||
    req.body.query == ""
  ) {
    res.status(400).send("bad request, query cannot be empty");
  } else {
    // Pagintion
    if (req.body.hasOwnProperty("pageNo") == false) {
      res.status(400).send("bad request, pageNo field is missing");
    } else {
      pageNo = Number(req.body.pageNo);
    }
    if (req.body.hasOwnProperty("pageSize") == false) {
      res.status(400).send("bad request, pageSize field is missing");
    } else {
      pageSize = Number(req.body.pageNo);
    }
    if (req.body.hasOwnProperty("didYouMean") == false) {
      res.status(400).send("bad request, didYouMean field is missing");
    } else {
      didYouMean = Boolean(req.body.didYouMean);
    }
    if (req.body.hasOwnProperty("applyLTR") == false) {
      res.status(400).send("bad request, applyLTR field is missing");
    } else {
      applyLTR = Boolean(req.body.applyLTR);
    }
    if (req.body.hasOwnProperty("highlight") == false) {
      res.status(400).send("bad request, highlight field is missing");
    } else {
      highlight = Boolean(req.body.highlight);
    }
   

    //VisibleFilter
    if (req.body.hasOwnProperty("visibleFilters") == false) {
      res.status(400).send("bad request, visibleFilters field is missing");
    } else {
      if (req.body.visibleFilters == null || req.body.visibleFilters == "") {
        // visibleFilters = "All"
      } else {
        // const filters = req.body.visibleFilters
        // console.log(filters)
        let visibleFilter = req.body.visibleFilters; //["specialization" , "languages"]
        let filters = [
          "yearsOfExperience",
          "languages",
          "specialization",
          "isVideoAllowed",
          "gender",
          "country",
          "averageRating",
          "city",
        ];
        for (i = 0; i < visibleFilter.length; i++) {
          if (!filters.includes(visibleFilter[i])) {
            res
              .status(400)
              .send(
                "bad request, filter cannot be done based on the given parameter"
              );
            break;
          }
        }
      }
    }

    if (req.body.hasOwnProperty("isStandAlone") == false) {
      res.status(400).send("bad request, isStandAlone field is missing");
    } else {
      isStandAlone = Boolean(req.body.isStandAlone);
    }

    //sorting
    if (req.body.sort) {
      //sort[req.body.sort]  === 'desc' ? -1 :
      // aggregate_options.push({$sort: {"data.start_date": sortOrder}});

      let sortBy = req.body.sort;

      const sortList = [
        "yearsOfExperience",
        "recommendation",
        "relevence",
        "earliestAvailable",
        "price",
      ];
      for (i = 0; i < sortBy.length; i++) {
        if (!sortList.includes(Object.keys(sortBy[i])[i])) {
          res
            .status(400)
            .send(
              "bad request, sorting cannot be done based on the given parameter"
            );
        }
      }
    }
    controller
      .getSearchDetails(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
}

router.post("/doctorSearch", getSearchDetails);

module.exports = router;
