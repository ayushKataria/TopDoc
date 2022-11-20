const esdb = require("../../utils/es_util");
const search = require("../search/controller");
const docController = require("../doctors/controller");

async function createNewDoctorAds(object) {
  try {
    const { v4: uuidv4 } = require("uuid");
    const newId = uuidv4();
    object.adId = newId;
    console.log("The uuid is ", newId);

    let entityCreationObj = await esdb.insert(object, newId, "ads");
    if (entityCreationObj.result == "created") {
      return { statuscode: 200, message: "Ad created Successfully" };
    } else {
      throw err;
    }
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in creating Ad",
    };
  }
}

async function updateDoctorAds(Identifier, role, updateFields) {
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

async function getAdsDetailsByDoctorId(body) {
  try {
    let esIndex = "ads";
    let esTemplate = "getAdsDetailsByDoctorId";
    let params = {};
    params.fromValue = body.pageNo * body.pageSize;
    params.sizeValue = body.pageSize;

    params.doctorIdValue = body.doctorId;
    params.boolDoctorId = true;

    params.avgClicksAggregation = true;
    params.avgAppearancesAggregation = true;
    params.avgAppearancesAggregationComma = true;
    params.minClicksAggregation = true;
    params.minClicksAggregationComma = true;
    params.maxClicksAggregation = true;
    params.maxClicksAggregationComma = true;
    params.minAppearancesAggregation = true;
    params.minAppearancesAggregationComma = true;
    params.maxAppearancesAggregation = true;
    params.maxAppearancesAggregationComma = true;

    if (Object.keys(body.sort).length === 0) {
      params.boolSort = false;
    } else {
      params.boolSort = true;
      params.sortField = Object.keys(body.sort)[0];
      params.sortOrder = Object.values(body.sort)[0];
    }

    if (body.filters.length > 0) {
      params.boolFilter = true;
      //   console.log("in if");
      for (let i = 0; i < body.filters.length; i++) {
        if (body.filters.length > 0) {
          let key = Object.keys(body.filters[i])[0];
          let value = Object.values(body.filters[i])[0];

          params = search.generateFilterStructure(params, key, value);
        }
      }
    } else {
      params.boolFilter = false;
    }
    console.log(params);
    let output = {};
    let dataOb = await esdb.templateSearch(params, esIndex, esTemplate);
    output.hits = dataOb.hits.total.value;
    for (let i = 0; i < dataOb.hits.hits.length; i++) {
      dataOb.hits.hits[i]._source.id = dataOb.hits.hits[i]._id;
    }
    output.results = dataOb.hits.hits.map((e) => {
      return e._source;
    });

    output.avgClicks =
      dataOb.aggregations.TotalAggs.avgClicksAggs.avgClicksAggs.value.toFixed(
        1
      );
    output.avgAppearances =
      dataOb.aggregations.TotalAggs.avgAppearancesAggs.avgAppearancesAggs.value.toFixed(
        1
      );
    output.maxClicks =
      dataOb.aggregations.TotalAggs.maxClicksAggs.maxClicksAggs.value.toFixed(
        1
      );
    output.maxAppearances =
      dataOb.aggregations.TotalAggs.maxAppearancesAggs.maxAppearancesAggs.value.toFixed(
        1
      );
    output.minAppearances =
      dataOb.aggregations.TotalAggs.minAppearancesAggs.minAppearancesAggs.value.toFixed(
        1
      );
    output.minClicks =
      dataOb.aggregations.TotalAggs.minClicksAggs.minClicksAggs.value.toFixed(
        1
      );
    return output;
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }
}

async function getAdsToShowToUserFromUserId(body) {
  try {
    let esIndex = "ads";
    let esTemplate = "getAdsDetailsByDoctorId";
    let query = {};
    let resultDistrict = [];
    let resultState = [];
    let startArray = body.pageNo * body.pageSize;
    let pageSize = body.pageSize;
    let output = {};

    if (body.userId === -1) {
      query.match_all = {};
      let adDataForGuestUser = await esdb.searchAll(query, esIndex);
      output.hits = adDataForGuestUser.hits.total.value;
      let guestResult = adDataForGuestUser.hits.hits.map((e) => {
        return e._source;
      });
      guestResult.sort(function (a, b) {
        let endDateA = new Date(a.endDate),
          endDateB = new Date(b.endDate);
        return endDateA - endDateB;
      });
      output.results = [];
      for (let i = startArray; i < startArray + pageSize; i++) {
        let adData = guestResult[i];
        if (adData == null) {
          break;
        } else {
          output.results.push(adData);
        }
      }
      return output;
    } else {
      let params = {};
      params.fromValue = body.pageNo * body.pageSize;
      params.sizeValue = body.pageSize;
      let paramsForDistrict = {};
      paramsForDistrict.fromValue = 0;
      paramsForDistrict.sizeValue = 9999;
      paramsForDistrict.boolTargetDistrictValue = [body.district];
      paramsForDistrict.boolTargetDistrict = true;
      let adDataBasedOnDistrict = await esdb.templateSearch(
        paramsForDistrict,
        esIndex,
        esTemplate
      );
      resultDistrict = adDataBasedOnDistrict.hits.hits.map((e) => {
        return e._source;
      });
      resultDistrict.sort(function (a, b) {
        let endDateA = new Date(a.endDate),
          endDateB = new Date(b.endDate);
        return endDateA - endDateB;
      });
      let paramsForState = {};
      paramsForState.fromValue = 0;
      paramsForState.sizeValue = 9999;
      paramsForState.boolTargetStateValue = [body.state];
      paramsForState.boolTargetState = true;
      let adDataBasedOnState = await esdb.templateSearch(
        paramsForState,
        esIndex,
        esTemplate
      );
      resultState = adDataBasedOnState.hits.hits.map((e) => {
        return e._source;
      });
      resultState.sort(function (a, b) {
        let endDateA = new Date(a.endDate),
          endDateB = new Date(b.endDate);
        return endDateA - endDateB;
      });
      let filteredResultForState = resultState.filter(function (ob) {
        return !ob.targetDistrict.includes(body.district);
      });
      output.hits = resultDistrict.length + filteredResultForState.length;
      let combinedResults = [...resultDistrict, ...filteredResultForState];
      output.results = [];
      for (let i = startArray; i < startArray + pageSize; i++) {
        let adData = combinedResults[i];
        if (adData == null) {
          break;
        } else {
          output.results.push(adData);
        }
      }
      return output;
    }
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }
}

async function getUserCountByDistrict(body) {
  try {
    let esIndex = "user";
    let Query = {};
    Query.query = {};
    let output = {};
    Query.query.terms = {};
    Query.query.terms = { "district.keyword": body.districts };
    let adDataForGuestUser = await esdb.search(Query, esIndex);
    output.totalUserCount = adDataForGuestUser.hits.total.value;

    return output;
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }
}

async function searchFieldInAds(body) {
  try {
    let esIndex = body.role;
    let Query = {};
    Query.query = {};
    let output = {};
    Query.query.term = {};
    Query.query.term = { status: body.status };
    let adDataForGuestUser = await esdb.search(Query, esIndex);
    output.hits = adDataForGuestUser.hits.total.value;
    output.results = adDataForGuestUser.hits.hits.map((e) => {
      return e._source;
    });

    return output;
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }
}

module.exports = {
  createNewDoctorAds,
  updateDoctorAds,
  getAdsDetailsByDoctorId,
  getAdsToShowToUserFromUserId,
  getUserCountByDistrict,
  searchFieldInAds,
};
