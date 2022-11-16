"use strict";
const aggsFunc = require("./searchAggrigation");
const esdb = require("../../utils/es_util");

async function getSearchDetails(body) {
  try {
    let esIndex = "doctor";
    let esTemplate = "doctorTemplate";
    let params = {};
    params.fromValue = body.pageNo * body.pageSize;
    params.sizeValue = body.pageSize;
    params.queryValue = body.query;

    //generating sort filters
    if (body.sort.length > 0) {
      params.boolSort = true;
      params.sortField = Object.keys(body.sort[0])[0];
      params.sortOrder = Object.values(body.sort[0])[0];
    } else {
      params.boolSort = false;
    }
    // temporay code starts
    (params.averageRatingAggregation = true),
      (params.averageRatingAggregationComma = true),
      (params.languagesAggregation = true),
      (params.languagesAggregationComma = true),
      (params.specializationAggregation = true),
      (params.specializationAggregationComma = true),
      (params.cityAggregation = true),
      (params.cityAggregationComma = true),
      (params.countryAggregation = true),
      (params.countryAggregationComma = true),
      (params.yearsOfExperienceAggregation = true),
      (params.yearsOfExperienceAggregationComma = true);
    params.genderAggregation = true;

    //processing of Filters
    if (Object.keys(body.filters.length > 0)) {
      params.boolFilter = true;
      //console.log("in if")
      for (let i = 0; i < body.filters.length; i++) {
        if (body.filters.length > 0) {
          let key = Object.keys(body.filters[i])[0];
          let value = Object.values(body.filters[i])[0][0];
          params = generateFilterStructure(params, key, value);
        }
      }
    } else {
      params.boolFilter = false;
    }
    let output = {};

    let dataOb = await esdb.templateSearch(params, esIndex, esTemplate);
    output.hits = dataOb.hits.total.value;
    let searchAggs = dataOb["aggregations"]["TotalAggs"];
    let searchFilterAggs = aggsFunc.aggegrationsData(searchAggs);
    output.result = dataOb.hits.hits.map((e) => {
      return e._source;
    }); //.map ,.filter ,.reduce
    output.filters = searchFilterAggs;

    return output;
  } catch (err) {
    console.log(err);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

function generateFilterStructure(params, key, value) {
  try {
    params["filter" + key.charAt(0).toUpperCase() + key.slice(1)] = true;
    params[key + "Value"] = value;
    console.log("ssstring", params);
    return params;
  } catch (error) {
    log.error("error", error);
    throw error.toString();
  }
}

module.exports = {
  getSearchDetails,
  generateFilterStructure,
};
