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
    let dataOb = await esdb.getData(queryBody, role);
    output.hits=dataOb.total.value
    output.results = dataOb.hits[0]._source
    // output.fields=dataOb.hits[0].fields
    
    // console.log("dataob is ", dataOb.total.value)
    // console.log(output)

    return output;
  } catch (err) {
    console.log("Error is ", err);
    return {
      statuscode: 404,
      message: "There was some error in fetchig the doctors list",
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
    return {
      statuscode: 404,
      message: "There was some error in fetchig the doctors list",
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
    return {
      statuscode: 404,
      message: "There was some error in creating profile",
      err,
    };
  }
}
module.exports = {
  getProfileDetailsController,
  createNewDoctorAccount,
  updateProfileDetailsController,
};
