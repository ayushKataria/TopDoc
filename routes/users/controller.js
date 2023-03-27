const bcrypt = require("bcrypt");
const docController = require("../doctors/controller");
const jwt = require("jsonwebtoken");
const esdb = require("../../ESUtils/elasticSearch");
const esdb1 = require("../../utils/es_util");
const queryBuilder = require("../../utils/queryBuilder.js");
const uuid = require("uuid");
const userSchema = require("./userSchema");
const adsController = require("../ads/controller");
const { result } = require("underscore");

function getDocByemailId(emailId, paramIndex) {
  let queryBody = {
    query: {
      term: {
        "email.keyword": emailId,
      },
    },
  };
  return esdb1.search(queryBody, paramIndex);
}
async function getDocByPhone(mobile, paramIndex) {
  let queryBody = {
    query: {
      term: {
        mobile: mobile,
      },
    },
  };
  console.log("Reaching the spot", JSON.stringify(queryBody));
  // return esdb.getData(queryBody, paramIndex);
  console.log("ESDB! IS ", esdb1);
  return await esdb1.search(queryBody, paramIndex);
}

function getUserQueryBody(req, id, emailId = null, phone = null, hashpassword) {
  let queryBody = userSchema();
  //console.log("password is:", password)
  if (emailId != null) {
    queryBody.email = emailId;
    queryBody.name = req.fullName;
    queryBody.password = hashpassword;
    //queryBody.dtCreated = dtCreated
  }

  return queryBody;
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
async function compareHashPassword(req_password, saved_Password) {
  try {
    const comparehashedPassword = await bcrypt.compare(
      req_password,
      saved_Password
    );

    console.log("Comparehashed pwd is ", comparehashedPassword);
    return comparehashedPassword;
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

async function signup(req, res) {
  try {
    let result = {};
    let id = null;
    let hashpassword = null;
    console.log("In signup block",JSON.stringify(req));
    if (req.hasOwnProperty("email")) {
      let userData = await getDocByemailId(req.email, "user");
      if (userData["hits"]["total"]["value"] > 0) {
        throw {
          statuscode: 499,
          err: "access denied",
          message: "This emailId is already registered",
        };
      } else {
        hashpassword = await hashPassword(req.password);
        id = uuid.v1();
        //let emailId = req.emailId
        //let password = hashpassword
        //let dtCreated = new Date()
        //let userQuery =  getUserQueryBody(req, id, emailId, hashpassword)
        let first_name = req.fullName.substring(0, req.fullName.indexOf(" "));
        let last_name = req.fullName.substring(req.fullName.indexOf(" ") + 1);
        let queryBody = userSchema();
        queryBody.email = req.email;
        queryBody.id = id;
        queryBody.name = req.fullName;
        queryBody.first_name = first_name;
        queryBody.mobile = req.mobileNumber;
        queryBody.gender = req.gender;
        queryBody.last_name = last_name;
        queryBody.password = hashpassword;
        //queryBody.dtCreated = dtCreated
        console.log("userQuery is:", queryBody);
        let userQueryUpdate = {
          id: id,
          body: {
            doc: queryBody,
          },
        };
        //let updateResult = await esdb.updateData(userQueryUpdate, "user").then(esResult => esResult).catch(err => {throw err})

        let updateResult = await Promise.all([
          esdb
            .updateData(userQueryUpdate, "user")
            .then((esResult) => esResult)
            .catch((err) => {
              throw err;
            }),
        ]);
      }
    } else if (req.hasOwnProperty("mobileNumber")) {
      let userData = await getDocByPhone(req.mobileNumber, "user");
      if (userData["hits"]["total"]["value"] > 0) {
        throw {
          statuscode: 499,
          err: "access denied",
          message: "This mobile number is already registered",
        };
      } else {
        hashpassword = await hashPassword(req.password);
        id = uuid.v1();
        //let emailId = req.emailId
        //let password = hashpassword
        //let dtCreated = new Date()
        //let userQuery =  getUserQueryBody(req, id, emailId, hashpassword)
        let first_name = req.fullName.substring(0, req.fullName.indexOf(" "));
        let last_name = req.fullName.substring(req.fullName.indexOf(" ") + 1);
        let queryBody = userSchema();
        queryBody.mobile = req.mobileNumber;
        queryBody.id = id;
        queryBody.name = req.fullName;
        queryBody.first_name = first_name;
        queryBody.last_name = last_name;
        queryBody.password = hashpassword;
        //queryBody.dtCreated = dtCreated
        console.log("userQuery is:", queryBody);
        let userQueryUpdate = {
          id: id,
          body: {
            doc: queryBody,
          },
        };
        //let updateResult = await esdb.updateData(userQueryUpdate, "user").then(esResult => esResult).catch(err => {throw err})

        let updateResult = await Promise.all([
          esdb
            .updateData(userQueryUpdate, "user")
            .then((esResult) => esResult)
            .catch((err) => {
              throw err;
            }),
        ]);
      }
    }
    result = { statuscode: 201, id: id, message: "registered successfully" };

    return result;
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

async function login(req, res) {
  try {
    let result = {};
    let id = null;
    let hashpassword = null;
    let isVerified = false;
    console.log("In login block");
    if (req.hasOwnProperty("emailId")) {
      let userData = await getDocByemailId(req.emailId, "user");
      let userDetailsRec = userData.hits.hits[0]._source;
      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        isVerified = await compareHashPassword(req.password, savedPassword);
        if (isVerified) {
          const token = jwt.sign(
            {
              email: userData["hits"]["hits"][0]["_source"]["email"],
              id: userData["hits"]["hits"][0]["_source"]["id"],
            },
            "secretKey",
            {
              expiresIn: "1h",
            }
          );
          result = {
            statuscode: 200,
            message: "Authorization successfull",
            token: token,
            userDetails: {
              mobile: userDetailsRec.mobile,
              name: userDetailsRec.name,
              profImageUrl: userDetailsRec.profImageUrl,
              userId: userDetailsRec.id,
              email: userDetailsRec.email,
              gender: userDetailsRec.gender,
              userType: userDetailsRec.userType,
            },
          };
        } else {
          result = { statuscode: 401, message: "Authorization failed" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }
    if (req.hasOwnProperty("mobileNumber")) {
      let userData = await getDocByPhone(req.mobileNumber, "user");
      let userDetailsRec = userData.hits.hits[0]._source;
      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        isVerified = await compareHashPassword(req.password, savedPassword);
        if (isVerified) {
          const token = jwt.sign(
            {
              mobileNo: userData["hits"]["hits"][0]["_source"]["mobile"],
              id: userData["hits"]["hits"][0]["_source"]["id"],
            },
            "secretKey",
            {
              expiresIn: "1h",
            }
          );
          result = {
            statuscode: 200,
            message: "Authorization successfull",
            token: token,
            userDetails: {
              mobile: userDetailsRec.mobile,
              name: userDetailsRec.name,
              profImageUrl: userDetailsRec.profImageUrl,
              userId: userDetailsRec.id,
              email: userDetailsRec.email,
              gender: userDetailsRec.gender,
              userType: userDetailsRec.userType,
            },
          };
        } else {
          result = { statuscode: 401, message: "Authorization failed" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }

    return result;
  } catch (error) {
    if (error.statuscode) {
      throw {
        statuscode: 401,
        err: "access denied",
        message: "Authorization failed",
      };
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}
//for doc
async function loginDoc(req, res) {
  try {
    let result = {};
    let id = null;
    let hashpassword = null;
    let isVerified = false;
    console.log("In login Doc block", req.password);
    if (req.hasOwnProperty("emailId")) {
      let userData = await getDocByemailId(req.emailId, "doctor");
      let userDetailsRec = userData.hits.hits[0]._source;

      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        console.log("Saved pwd is ", savedPassword);
        isVerified = await compareHashPassword(req.password, savedPassword);
        if (isVerified) {
          const token = jwt.sign(
            {
              email: userData["hits"]["hits"][0]["_source"]["email"],
              id: userData["hits"]["hits"][0]["_source"]["id"],
            },
            "secretKey",
            {
              expiresIn: "1h",
            }
          );
          result = {
            statuscode: 200,
            message: "Authorization successfull",
            token: token,
            docDetails: {
              mobile: userDetailsRec.mobile,
              name: userDetailsRec.name,
              profImageUrl: userDetailsRec.profImageUrl,
              userId: userDetailsRec.id,
              email: userDetailsRec.email,
              gender: userDetailsRec.gender,
              username: userDetailsRec.username,
              first_name: userDetailsRec.firstName,
              last_name: userDetailsRec.lastName,
              testKeywordList: userDetailsRec.testsKeywordList,
              symptomsKeywordList: userDetailsRec.symptomsKeywordList,
            },
          };
        } else {
          result = { statuscode: 401, message: "Authorization failed" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }
    console.log("phone present ", req.hasOwnProperty("mobile"));
    if (req.hasOwnProperty("mobile")) {
      let userData = await getDocByPhone(req.mobile, "doctor");
      console.log("USER IS ", userData.hits.hits[0]._source);
      let userDetailsRec = userData.hits.hits[0]._source;
      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        isVerified = true;
        if (isVerified) {
          const token = jwt.sign(
            {
              phone: userData["hits"]["hits"][0]["_source"]["mobile"],
              id: userData["hits"]["hits"][0]["_source"]["id"],
            },
            "secretKey",
            {
              expiresIn: "1h",
            }
          );
          console.log(
            "jwt token is ",
            token + " test list is " + userDetailsRec.testsKeywordList
          );
          result = {
            statuscode: 200,
            message: "Authorization successfull",
            token: token,
            docDetails: {
              mobile: userDetailsRec.mobile,
              name: userDetailsRec.name,
              profImageUrl: userDetailsRec.profImageUrl,
              userId: userDetailsRec.id,
              email: userDetailsRec.email,
              gender: userDetailsRec.gender,
              username: userDetailsRec.username,
              first_name: userDetailsRec.firstName,
              last_name: userDetailsRec.lastName,
              testKeywordList: userDetailsRec.testsKeywordList,
              symptomsKeywordList: userDetailsRec.symptomsKeywordList,
            },
          };
        } else {
          result = { statuscode: 401, message: "Authorization failed" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }

    return result;
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
//for staff login
async function loginStaff(req) {
  try {
    let result = {};
    let id = null;
    let hashpassword = null;
    let isVerified = false;
    console.log("In login block for staff");
    if (req.body.hasOwnProperty("mobile")) {
      let staffData = await getDocByPhone(req.mobile, "staff");
      let staffDetailsList = staffData["hits"]["hits"][0]["_source"];
      if (staffData["hits"]["total"]["value"] > 0) {
        if (req.body.hasOwnProperty("pin")) {
          let savedPin = staffData["hits"]["hits"][0]["_source"]["pin"];
          isVerified = await compareHashPassword(req.pin, savedPin);
          if (isVerified) {
            const token = jwt.sign(
              {
                mobileNo: staffData["hits"]["hits"][0]["_source"]["mobile"],
                id: staffData["hits"]["hits"][0]["_source"]["staffId"],
              },
              "secretKey",
              {
                expiresIn: "1h",
              }
            );
            result = {
              statuscode: 200,
              message: "Authorization successfull",
              token: token,
              staffDetails: {
                mobile: staffDetailsList.mobile,
                staffId: staffDetailsList.staffId,
                email: staffDetailsList.email,
                mappedToDoctors: staffDetailsList.mappedTo,
                first_name: staffDetailsList.firstName,
                last_name: staffDetailsList.lastName,
                designation: staffDetailsList.designation,
              },
            };
          } else {
            result = { statuscode: 401, message: "Authorization failed" };
          }
        } else if (req.body.hasOwnProperty("password")) {
          let savedPassword =
            staffData["hits"]["hits"][0]["_source"]["password"];
          isVerified = await compareHashPassword(req.password, savedPassword);
          if (isVerified) {
            const token = jwt.sign(
              {
                mobileNo: staffData["hits"]["hits"][0]["_source"]["mobile"],
                id: staffData["hits"]["hits"][0]["_source"]["staffId"],
              },
              "secretKey",
              {
                expiresIn: "1h",
              }
            );
            result = {
              statuscode: 200,
              message: "Authorization successfull",
              token: token,
              staffDetails: {
                mobile: staffDetailsList.mobile,
                staffId: staffDetailsList.staffId,
                email: staffDetailsList.email,
                mappedToDoctors: staffDetailsList.mappedTo,
                first_name: staffDetailsList.firstName,
                last_name: staffDetailsList.lastName,
                designation: staffDetailsList.designation,
              },
            };
          } else {
            result = { statuscode: 401, message: "Authorization failed" };
          }
        } else {
          result = { statuscode: 401, message: "Staff is not registered" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }

    return result;
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

async function changePassword(req, res) {
  try {
    let result = {};
    let isVerified = false;
    //console.log("In login block")
    if (req.hasOwnProperty("emailId")) {
      let userData = await getDocByemailId(req.emailId, "user");
      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        console.log(savedPassword);
        isVerified = await compareHashPassword(req.password, savedPassword);
        if (isVerified) {
          let pass = req.newPassword;
          pass = await hashPassword(pass);
          queryBody = {
            script: {
              source: "ctx._source.password = params.password",
              params: {
                password: pass,
              },
            },
            query: {
              term: {
                "email.keyword": req.emailId,
              },
            },
          };
          //console.log("newQueryBody",queryBody)
          let updateResult = await Promise.all([
            esdb.updateDataByQuery(queryBody, "user"),
          ]);
          //console.log(updateResult)
          if (!updateResult[0].hasOwnProperty("status"))
            result = {
              statuscode: 200,
              message: "password successfully changed",
            };
        } else {
          result = { statuscode: 401, message: "Wrong Password" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    } else if (req.hasOwnProperty("mobileNumber")) {
      let userData = await getDocByPhone(req.mobileNumber, "user");
      if (userData["hits"]["total"]["value"] > 0) {
        let savedPassword = userData["hits"]["hits"][0]["_source"]["password"];
        console.log(savedPassword);
        isVerified = await compareHashPassword(req.password, savedPassword);
        if (isVerified) {
          let pass = req.newPassword;
          pass = await hashPassword(pass);
          queryBody = {
            script: {
              source: "ctx._source.password = params.password",
              params: {
                password: pass,
              },
            },
            query: {
              term: {
                mobile: req.mobileNumber,
              },
            },
          };
          //console.log("newQueryBody",queryBody)
          let updateResult = await Promise.all([
            esdb.updateDataByQuery(queryBody, "user"),
          ]);
          //console.log(updateResult)
          if (!updateResult[0].hasOwnProperty("status"))
            result = {
              statuscode: 200,
              message: "password successfully changed",
            };
        } else {
          result = { statuscode: 401, message: "Wrong Password" };
        }
      } else {
        throw {
          statuscode: 401,
          err: "access denied",
          message: "Authorization failed",
        };
      }
    }

    return result;
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

async function updateProfile(req) {
  try {
    let userData = {};
    console.log("here in this block");
    if (req.hasOwnProperty("emailId"))
      userData = await getDocByemailId(req.emailId, "user");
    else if (req.hasOwnProperty("mobileNumber"))
      userData = await getDocByPhone(req.mobileNumber, "user");

    let id = userData["hits"]["hits"][0]["_source"]["id"];
    let userUpdateQuery = queryBuilder.userUpdateQueryBody(req, id);
    console.log(userUpdateQuery);
    let updateResult = await Promise.all([
      esdb.updateDataByQuery(userUpdateQuery, "user"),
    ]);
    //console.log(updateResult)
    if (!updateResult[0].hasOwnProperty("status"))
      result = { statuscode: 200, message: "updated successfully" };
    else result = { statuscode: 400, message: "update unsuccessfull" };
    return result;
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

// function userUpdateQueryBody(obj, id){
//     let arrOfConcatSource = []
//     userUpdateQuery = {
//         "script":{
//             "source":{

//             },
//             "params":{

//             }
//         },
//         "query": {
//             "term":{
//                 "id":id
//             }
//         }
//     }

//     if(obj.hasOwnProperty('DOB')){
//         arrOfConcatSource.push("ctx._source.DOB = params.DOB")
//         userUpdateQuery.script.params.DOB = obj.DOB
//     }
//     if(obj.hasOwnProperty('gender')){
//         arrOfConcatSource.push("ctx._source.gender = params.gender")
//         userUpdateQuery.script.params.gender = obj.gender
//     }
//     if(obj.hasOwnProperty('email')){
//         arrOfConcatSource.push("ctx._source.email = params.email")
//         userUpdateQuery.script.params.email = obj.email
//     }
//     if(obj.hasOwnProperty('mobile')){
//         arrOfConcatSource.push("ctx._source.mobile = params.mobile")
//         userUpdateQuery.script.params.mobile = obj.mobile
//     }
//     if(obj.hasOwnProperty('address')){
//         arrOfConcatSource.push("ctx._source.address = params.address")
//         userUpdateQuery.script.params.address = obj.address
//     }
//     if(obj.hasOwnProperty('landmark')){
//         arrOfConcatSource.push("ctx._source.landmark = params.landmark")
//         userUpdateQuery.script.params.landmark = obj.landmark
//     }
//     if(obj.hasOwnProperty('locality')){
//         arrOfConcatSource.push("ctx._source.locality = params.locality")
//         userUpdateQuery.script.params.locality = obj.locality
//     }
//     if(obj.hasOwnProperty('city')){
//         arrOfConcatSource.push("ctx._source.city = params.city")
//         userUpdateQuery.script.params.city = obj.city
//     }
//     if(obj.hasOwnProperty('state')){
//         arrOfConcatSource.push("ctx._source.state = params.state")
//         userUpdateQuery.script.params.state = obj.state
//     }
//     if(obj.hasOwnProperty('country')){
//         arrOfConcatSource.push("ctx._source.country = params.country")
//         userUpdateQuery.script.params.country = obj.country
//     }
//     if(obj.hasOwnProperty('Zipcode')){
//         arrOfConcatSource.push("ctx._source.Zipcode = params.Zipcode")
//         userUpdateQuery.script.params.Zipcode = obj.Zipcode
//     }
//     if(obj.hasOwnProperty('role')){
//         arrOfConcatSource.push("ctx._source.role = params.role")
//         userUpdateQuery.script.params.role = obj.role
//     }
//     if(obj.hasOwnProperty('language')){
//         arrOfConcatSource.push("ctx._source.language = params.language")
//         userUpdateQuery.script.params.language = obj.language
//     }
//     if(obj.hasOwnProperty('blood_donor')){
//         arrOfConcatSource.push("ctx._source.blood_donor = params.blood_donor")
//         userUpdateQuery.script.params.blood_donor = obj.blood_donor
//     }

//     let text = arrOfConcatSource.join("; ");
//     userUpdateQuery.script.source = text
//     return userUpdateQuery
// }

async function viewProfile(req) {
  try {
    let result = {};
    if (req.hasOwnProperty("emailId")) {
      let queryBody = {
        _source: {
          exclude: ["password"],
        },
        query: {
          term: {
            "email.keyword": req.emailId,
          },
        },
      };
      console.log(queryBody);
      userData = await esdb.getData(queryBody, "user");
      result.percentOfCompletion = 0;
      result.userData = userData["hits"]["hits"][0]["_source"];

      return result;
    } else if (req.hasOwnProperty("mobileNumber")) {
      let queryBody = {
        _source: {
          exclude: ["password"],
        },
        query: {
          term: {
            mobile: req.mobileNumber,
          },
        },
      };
      console.log(queryBody);
      userData = await esdb.getData(queryBody, "user");
      result.percentOfCompletion = 0;
      result.userData = userData["hits"]["hits"][0]["_source"];

      return result;
    }
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

async function medicalDetails(body) {
  try {
    id = body.id;
    role = body.role;
    fieldsToFetch = body.fields;
    size = body.size;
    let data = await docController.getProfileDetailsController(id, role, [
      "medicalDetails",
    ]);
    data = data.results[0].medicalDetails;
    data.sort(function (a, b) {
      var dateA = new Date(a.orderDate),
        dateB = new Date(b.orderDate);
      return dateB - dateA;
    });
    let MedicalList = [];
    if (size > data.length) {
      size = data.length;
    }
    for (let i = 0; i < size; i++) {
      let fieldData = data[i][fieldsToFetch]; //hardcode value is working
      let fieldDate = data[i].orderDate;
      if (fieldData == null) {
        size = size + 1;
      } else {
        MedicalList.push({ date: fieldDate, data: fieldData });
      }
    }
    return MedicalList;
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

async function favouriteDoctor(body) {
  try {
    console.log("Fields to fetch 1");
    sort = body.sort || "desc";
    id = body.id;
    role = body.role;
    fieldsToFetch = body.fields;
    size = body.size || 10;
    page = body.page || 1;
    console.log("Fields to fetch 1", fieldsToFetch);
    // console.log("Fields to fetch ",fieldsToFetch)
    let data = await docController.getProfileDetailsController(id, role, [
      "favouriteDoctor",
    ]);
    // .then((data) => res.send(data))
    data = data.results[0].favouriteDoctor;
    console.log("Data is ", data);
    let hits = data.length;
    // .catch((err) => res.status(err.statuscode).send(err));
    // console.log("Fields to fetch 1", data)
    data.sort(function (a, b) {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      console.log(fieldsToFetch, "working");
      return sort == "desc" ? dateB - dateA : dateA - dateB;
    });
    console.log("Fields to fetchaaaaaaaaaaaaaaaaaaaa", fieldsToFetch);
    let doctorList = [];
    //console.log(fieldsToFetch);
    // for (let i = 1; i <= size; i++) {

    let fieldData = data.slice((page - 1) * size, page * size); //hardcode value is working
    console.log(fieldData);
    doctorList.push(fieldData);
    return { hits: hits, result: doctorList };
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

async function staffIsRegistredOrUnregistered(req) {
  try {
    let output = await adsController.searchFieldInIndex(req);
    console.log(output);

    if (output.hits == 0) {
      return {
        statuscode: 404,
        message: "Document not found",
        staffStatus: "notPresent",
      };
    } else if (output.hits == 1) {
      if (
        output.results[0].hasOwnProperty("pin") &&
        output.results[0].hasOwnProperty("password") &&
        output.results[0].pin != "" &&
        output.results[0].password != ""
      ) {
        return {
          statuscode: 200,
          message: "staff is registered",
          staffStatus: "registered",
        };
      } else if (
        output.results[0].hasOwnProperty("pin") == false ||
        output.results[0].hasOwnProperty("password") == false ||
        output.results[0].pin == "" ||
        output.results[0].password == ""
      ) {
        return {
          statuscode: 200,
          message: "staff is unRegistered",
          staffStatus: "unRegistered",
          staffId: output.results[0].staffId,
        };
      }
    } else if (output.hits > 1) {
      return {
        statuscode: 200,
        message: "More than one Document found",
        documents: output,
      };
    } else {
      throw error;
    }
    return;
  } catch (error) {
    throw {
      statuscode: 500,
      err: "internal server error",
      message: "unexpected error",
    };
  }
}

module.exports = {
  signup,
  login,
  loginStaff,
  loginDoc,
  changePassword,
  updateProfile,
  viewProfile,
  medicalDetails,
  favouriteDoctor,
  getUserQueryBody,
  staffIsRegistredOrUnregistered,
};
