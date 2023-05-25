"use strict";
// const esdb1 = require("../../ESUtils/elasticSearch");
const esdb = require("../../utils/es_util");
const uuid = require("uuid");
const _ = require("underscore");
const doctorAttributes = require("./constants/docAttributeList");
const bcrypt = require("bcrypt");
const { log } = require("winston");
//get doctor data with the help of docId
async function getProfileDetailsController(Identifier, role, fieldsToFetch) {
  try {
    console.log("try",Identifier);
    let queryBody;
    if (fieldsToFetch[0] === "all") {
      queryBody = {
        size: 10000,
        _source: true,
        query: {
          term: {
            _id: {
              value: Identifier,
            },
          },
        },
      };
    } else {
      queryBody = {
        size: 10000,
        _source: fieldsToFetch,
        query: {
          term: {
            _id: {
              value: Identifier,
            },
          },
        },
      };
    }
    console.log("esdb",queryBody);
    let output = {};
    output.results = [];
    let dataOb = await esdb.search(queryBody, role);
    if (dataOb.hits.total.value == 0) {
      throw Error("no data present");
    }
    output.hits = dataOb.hits.total.value;
    output.results = dataOb.hits.hits.map((e) => {
      return e._source;
    });
    return output;
  } catch (err) {
    console.log("Error is ", err);
    throw {
      statuscode: 404,
      message: "No such document exist",
    };
  }
}

//update profile data
async function updateProfileDetailsController(Identifier, role, updateFields) {
  try {
    let output = {};
    let dataObj = await esdb.update(role, Identifier, updateFields);

    if (dataObj.hasOwnProperty("result") == true) {
      if (dataObj.result == "noop") {
        output.results = "please enter a new Field Values to update";
      } else {
        output.results = dataObj.result;
      }
      return output;
    }
    return dataObj;
  } catch (err) {
    console.log("Error is ", err);
    throw {
      statuscode: 400,
      message: "There was some error in updating the data",
    };
  }
}

//create new doctor
async function createNewDoctorAccount(object) {
  try {
    // console.log("inside controller");
    const newId = uuid.v4();
    object.id = newId;
    const role = object.role;
    object = _.omit(object, "role");
    console.log("The uuid is ", newId);
    object.password = await hashPassword(object.password);
    let entityCreationObj = await esdb.insert(object, newId, role);
    console.log(entityCreationObj);
    if (entityCreationObj.result == "created") {
      return {
        statuscode: 200,
        message: "Profile created Successfully",
        id: newId,
      };
    } else {
      throw err;
    }
  } catch (err) {
    console.log("ERROR IS",err)
    throw {
      statuscode: 404,
      message: "There was some error in creating profile",
    };
  }
}
async function hashPassword(org_password) {
  try {
    const hashedPassword = await bcrypt.hash(org_password, 10);
    return hashedPassword;
  } catch (error) {
    if (error.statuscode) {
      throw error;
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}
async function createNewReview(object, role) {
  try {
    const { v4: uuidv4 } = require("uuid");
    const newId = uuidv4();
    object.id = newId;
    let output = {};
    let entityCreationObj = await esdb.insert(object, newId, role);
    if (entityCreationObj.result === "created") {
      output.result = "review posted Successfully";
    } else {
      output.result = "NOT created";
      output.message = "Sorry , unable to post the review ";
    }
    let getResult = await getProfileDetailsController(
      object.doctorId,
      "doctor",
      ["noOfReviews", "reviewTags", "averageRating"]
    );
    let reviewTagsList = doctorAttributes.reviewTags;
    let incomingReviewTagsKeys = object.reviewTags;
    let noOfReviews = getResult.results[0].noOfReviews;
    let averageRating = getResult.results[0].averageRating;
    averageRating =
      (averageRating * noOfReviews + object.reviewRating) / (noOfReviews + 1);
    noOfReviews = parseInt(noOfReviews) + 1;
    let reviewTags = getResult.results[0].reviewTags;
    console.log("Review TAGS ",getResult)
    let reviewTagsKeys = Object.keys(reviewTags);
    for (let i = 0; i < reviewTagsList.length; i++) {
      let currTag = reviewTagsList[i];
      if (incomingReviewTagsKeys.includes(currTag)) {
        if (!reviewTagsKeys.includes(currTag)) {
          reviewTags[currTag] = 1;
        } else {
          reviewTags[currTag] = parseInt(reviewTags[currTag]) + 1;
        }
      }
    }

    output.doctorUpdated = await updateProfileDetailsController(
      object.doctorId,
      "doctor",
      {
        reviewTags: reviewTags,
        noOfReviews: noOfReviews,
        averageRating: averageRating,
      }
    );

    return output;
  } catch (err) {
    console.log(err);
    throw {
      statuscode: 404,
      message: "There was some error in creating Review",
    };
  }
}

async function getReviewsDetails(body) {
  try {
    let esIndex = body.role;
    let esTemplate = "reviewTemplate";
    let params = {};
    params.fromValue = body.pageNo * body.pageSize;
    params.sizeValue = body.pageSize;

    if (body.hasOwnProperty("sort") == true && body.sort.length > 0) {
      params.boolSort = true;
      params.sortVal = body.sort;
    } else {
      params.boolSort = false;
    }

    if (body.hasOwnProperty("doctorId") && body.hasOwnProperty("userId")) {
      params.boolUserId = true;
      params.userIdValue = body.userId;
      params.boolDoctorId = true;
      params.boolDoctorIdComma = true;
      params.doctorIdValue = body.doctorId;
      params.avgReviewRatingAggregation = true;
      params.rangeReviewRatingAggregation = true;
      params.rangeReviewRatingAggregationComma = true;
      params.reviewTagsAggregationComma = true;
      params.reviewTagsAggregation = true;
    } else if (body.hasOwnProperty("doctorId")) {
      params.boolDoctorId = true;
      params.doctorIdValue = body.doctorId;
      params.avgReviewRatingAggregation = true;
      params.rangeReviewRatingAggregation = true;
      params.rangeReviewRatingAggregationComma = true;
      params.reviewTagsAggregationComma = true;
      params.reviewTagsAggregation = true;
    } else if (body.hasOwnProperty("userId")) {
      params.boolUserId = true;
      params.userIdValue = body.userId;
      params.avgReviewRatingAggregation = false;
      params.rangeReviewRatingAggregation = false;
      params.rangeReviewRatingAggregationComma = false;
    }

    let output = {};
    let dataOb = await esdb.templateSearch(params, esIndex, esTemplate);
    console.log("Data ob is ", dataOb);
    output.hits = dataOb.hits.total.value;
    for (let i = 0; i < dataOb.hits.hits.length; i++) {
      dataOb.hits.hits[i]._source.id = dataOb.hits.hits[i]._id;
    }
    output.results = dataOb.hits.hits.map((e) => {
      return e._source;
    });

    if (body.hasOwnProperty("doctorId") && output.hits > 0) {
      output.reviewTagsAggs =
        dataOb.aggregations.TotalAggs.avgReviewRatingAggs.avgReviewRatingAggs.value.toFixed(
          1
        );
      output.avgReviewRating =
        dataOb.aggregations.TotalAggs.reviewTagsAggs.reviewTagsAggs.buckets;
      output.rangeReviewRating =
        dataOb.aggregations.TotalAggs.rangeReviewRatingAggs.rangeReviewRatingAggs.buckets;
    }
    return output;
  } catch (err) {
    console.log("error is : ", err);
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }
}
async function getRecommendedDoctors(body) {
  try {
    let esIndex = "doctor";
    let query = {};
    let output = {};
    let response;
    query = {
      size: body.size,
      sort: [],
      query: {
        bool: {
          must: [
            {
              exists: {
                field: "profileCreationDate",
              },
            },
          ],
          filter: [],
        },
      },
    };

    if (body.isLatestProfiles) {
      query.sort.push({ profileCreationDate: "desc" });
    }

    if (body.hasOwnProperty("isRegional")) {
      query.query.bool.filter[0] = {
        terms: { district: body.isRegional.districts },
      };
    }

    let res = await esdb.search(query, esIndex);

    output.hits = res.hits.hits.length;
    output.results = res.hits.hits.map((e) => {
      return e._source;
    });
    let results = output.results;
    let i = 0;
    while (body.hasOwnProperty("isRegional") && results.length < body.size) {
      if (i == 0) {
        query.query.bool.must_not = [];
        query.query.bool.must_not[i] = query.query.bool.filter[0];
        query.query.bool.filter[0] = {
          terms: { state: body.isRegional.state },
        };
        i++;
      } else if (i == 1) {
        query.query.bool.must_not[i] = query.query.bool.filter[0];
        query.query.bool.filter[0] = {
          term: { country: "India" },
        };
        i++;
      } else {
        break;
      }
      response = await esdb.search(query, esIndex);
      response = response.hits.hits.map((e) => {
        return e._source;
      });
      results.push(...response.slice(0, body.size - results.length));
      output.hits = results.length;
      output.results = results;
    }

    if (body.isRandom) {
      for (let i = output.results.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [output.results[i], output.results[j]] = [
          output.results[j],
          output.results[i],
        ];
      }
    }

    return output;
  } catch (err) {
    console.log("error is : ", err);
    throw {
      statuscode: 404,
      message: "There was some error in fetching the recommended doctors",
    };
  }
}

async function ConvertDateFormat(date) {
  try {
    console.log("THE DATE IS ", date);
    let temp = new Date(date).toISOString();
    let timeZone = new Date(date).getTimezoneOffset();
    let finalFormat;
    let finalTimeZone;
    let isNegative;
    if (timeZone < 0) {
      timeZone = timeZone * -1;
      isNegative = true;
    }
    let hours = timeZone / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    if (Math.floor(rhours / 10) == 0) {
      rhours = "0" + rhours;
    } else if (Math.floor(rminutes / 10) == 0) {
      rminutes = "0" + rminutes;
    } else {
      finalTimeZone = rhours + rminutes;
    }
    finalTimeZone = rhours + rminutes;
    if (isNegative) {
      finalTimeZone = "-" + finalTimeZone;
    } else {
      finalTimeZone = "+" + finalTimeZone;
    }
    finalFormat = temp.replace("Z", finalTimeZone);
    console.log("final date format --> ",finalFormat)
    return finalFormat;
  } catch (error) {
    console.log("Error is ", error);
    throw {
      statuscode: 400,
      message: "There was some error in converting Date Format",
    };
  }
}

module.exports = {
  getProfileDetailsController,
  createNewDoctorAccount,
  updateProfileDetailsController,
  createNewReview,
  getReviewsDetails,
  ConvertDateFormat,
  getRecommendedDoctors,
};
