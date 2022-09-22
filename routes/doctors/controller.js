'use strict'
const esdb = require("../../ESUtils/elasticSearch");

//get doctor data with the help of docId
async function getProfileDetailsController(Identifier, role, fieldsToFetch) {
  try {
    console.log("try");
    let queryBody;
    if (fieldsToFetch[0] === "all") {
      queryBody = {
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
        _source: fieldsToFetch,
        query: {
          term: {
            _id: {
              value: Identifier,
            },
          },
        },
        // fields: fieldsToFetch,
      };
    }
    console.log("esdb")
    let output={}
    output.results=[]
    let dataOb = await esdb.getData(queryBody, role);
    if (dataOb.hits.total.value == 0) { 
      throw err;
    }
    output.hits=dataOb.hits.total.value
    for (let i = 0; i < output.hits; i++) { 
    //  console.log("lllllllllllllllllllllllllllllllllllllll")
      dataOb.hits.hits[i]._source.id = dataOb.hits.hits[i]._id;
      
      
    }
   // output.results.push(dataOb.hits.hits[i])
   output.results = dataOb.hits.hits.map((e) => { return  e._source  })
    
    // output.fields=dataOb.hits.hits[0].fields

    return output;
  } catch (err) {
    // console.log("Error is ", err);
    throw {
      statuscode: 404,
      message: "No such document exist",
    };
  }
}

//update profile data
async function updateProfileDetailsController(Identifier, role, updateFields) {
  try {
    let output={}
    let dataObj = await esdb.updateData(role, Identifier, updateFields);
    
    output.results = dataObj.result
    if (dataObj.hasOwnProperty("result") == true) { 
      return output
    }
    return dataObj
    
  } catch (err) {
    // console.log("error caught in esdb",err)
    // console.log(err)
    throw {

      statuscode: 400,
      message: "please enter a new Field Value to update",
    };
  }
}

//create new doctor
async function createNewDoctorAccount(object) {
  try {
    const { v4: uuidv4 } = require("uuid");
    const newId = uuidv4();
    object.id = newId;
    //console.log("The request in controller is ",object)
    //console.log("The uuid is ",newId)

    let entityCreationObj = await esdb.createEntity(object, "doctor");
    //console.log("entityCreationObj",entityCreationObj)
    return { statuscode: 200, message: "Profile created Successfully" };
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in creating profile",
    };
  }
}

async function createNewReview(object,role) {
  try {
    const { v4: uuidv4 } = require("uuid");
    const newId = uuidv4();
    object.id = newId;
let output={}
    let entityCreationObj = await esdb.createEntity(object, role);
    if (entityCreationObj.result === "created") { 
output.result = "review posted Successfully"
    } else {
      output.result="NOT created"
      output.message="Sorry , unable to post the review "
    }

    return output
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in creating Review",
    };
  }
}

async function getReviewsDetails(body){
    
  try{
    console.log("in controller")
      let esIndex = body.role
      let esTemplate = "reviewTemplate"
      let params = {}
      params.fromValue = body.pageNo * body.pageSize
    params.sizeValue = body.pageSize
    if (body.hasOwnProperty("doctorId") && body.hasOwnProperty("userId")) {
      params.boolUserId = true
      params.userIdValue = body.userId
      params.boolDoctorId = true
      params.boolDoctorIdComma = true
      params.doctorIdValue = body.doctorId
      params.avgReviewRatingAggregation = true
      params.rangeReviewRatingAggregation = true
      params.rangeReviewRatingAggregationComma = true
      params.avgAccurateDiagnosisRatingAggregation = true
      params.avgAccurateDiagnosisRatingAggregationComma =  true
      params.avgFriendlinessAndWaitTimeRatingAggregation =  true
      params.avgFriendlinessAndWaitTimeRatingAggregationComma = true
      params.avgBedsideMannerismRatingAggregation =  true
      params.avgBedsideMannerismRatingAggregationComma =  true
      params.avgStaffCourteousnessRatingAggregation =  true
      params.avgStaffCourteousnessRatingAggregationComma = true
      params.avgPatientEducationRatingAggregation =  true
      params.avgPatientEducationRatingAggregationComma =  true
    } else if (body.hasOwnProperty("doctorId")) { 
      params.boolDoctorId = true
      params.doctorIdValue = body.doctorId
      params.avgReviewRatingAggregation = true
      params.rangeReviewRatingAggregation = true
      params.rangeReviewRatingAggregationComma = true
      params.avgAccurateDiagnosisRatingAggregation = true
      params.avgAccurateDiagnosisRatingAggregationComma =  true
      params.avgFriendlinessAndWaitTimeRatingAggregation =  true
      params.avgFriendlinessAndWaitTimeRatingAggregationComma = true
      params.avgBedsideMannerismRatingAggregation =  true
      params.avgBedsideMannerismRatingAggregationComma =  true
      params.avgStaffCourteousnessRatingAggregation =  true
      params.avgStaffCourteousnessRatingAggregationComma = true
      params.avgPatientEducationRatingAggregation =  true
      params.avgPatientEducationRatingAggregationComma =  true
    }else if (body.hasOwnProperty("userId")) { 
      params.boolUserId = true
      params.userIdValue = body.userId
      params.avgReviewRatingAggregation = false
      params.rangeReviewRatingAggregation = false
      params.rangeReviewRatingAggregationComma = false
      params.avgAccurateDiagnosisRatingAggregation = false
      params.avgAccurateDiagnosisRatingAggregationComma =  false
      params.avgFriendlinessAndWaitTimeRatingAggregation =  false
      params.avgFriendlinessAndWaitTimeRatingAggregationComma = false
      params.avgBedsideMannerismRatingAggregation =  false
      params.avgBedsideMannerismRatingAggregationComma =  false
      params.avgStaffCourteousnessRatingAggregation =  false
      params.avgStaffCourteousnessRatingAggregationComma = false
      params.avgPatientEducationRatingAggregation =  false
      params.avgPatientEducationRatingAggregationComma =  false
    }

    if (Object.keys(body.sort).length === 0) {
      params.boolSort = false
    } else { 
      params.boolSort = true
      params.sortField = Object.keys(body.sort)[0]
      params.sortOrder = Object.values(body.sort)[0]
    }
      
      console.log("params hereeeeeeeee",params)
    let output = {} 
 let dataOb = await esdb.templateSearch(params, esIndex, esTemplate)
    output.hits = dataOb.hits.total.value
    for (let i = 0; i < dataOb.hits.hits.length; i++) { 
      dataOb.hits.hits[i]._source.id = dataOb.hits.hits[i]._id;
    }
    output.results = dataOb.hits.hits.map((e) => { return  e._source  })
      
    if (body.hasOwnProperty("doctorId")) { 
      output.avgReviewRating = dataOb.aggregations.TotalAggs.avgReviewRatingAggs.avgReviewRatingAggs.value.toFixed(1)
      output.avgPatientEducationRating = dataOb.aggregations.TotalAggs.avgPatientEducationRatingAggs.avgPatientEducationRatingAggs.value.toFixed(1)
      output.avgStaffCourteousnessRating = dataOb.aggregations.TotalAggs.avgStaffCourteousnessRatingAggs.avgStaffCourteousnessRatingAggs.value.toFixed(1)
      output.avgFriendlinessAndWaitTimeRating = dataOb.aggregations.TotalAggs.avgFriendlinessAndWaitTimeRatingAggs.avgFriendlinessAndWaitTimeRatingAggs.value.toFixed(1)
      output.avgAccurateDiagnosisRating = dataOb.aggregations.TotalAggs.avgAccurateDiagnosisRatingAggs.avgAccurateDiagnosisRatingAggs.value.toFixed(1)
      output.avgBedsideMannerismRating = dataOb.aggregations.TotalAggs.avgBedsideMannerismRatingAggs.avgBedsideMannerismRatingAggs.value.toFixed(1)
      output.rangeReviewRating = dataOb.aggregations.TotalAggs.rangeReviewRatingAggs.rangeReviewRatingAggs.buckets
    }
      return output;

  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in fetching Reviews",
    };
  }  
}

module.exports = {
  getProfileDetailsController,
  createNewDoctorAccount,
  updateProfileDetailsController,
  createNewReview,
  getReviewsDetails
};
