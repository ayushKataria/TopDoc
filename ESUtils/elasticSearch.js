const elasticsearch = require('elasticsearch');
const { json } = require('express');

let elasticSearchClient=null
//Akash Elastic pass

 var auth = 'elastic' + ":" + 'j*+44bej_O0ZsUlUxFH5'

 const connstring = "https://" + 'localhost' + ":" + '9200'
 const enable_password=true;
 function connectClient() {
     if (enable_password == true) {
        console.log('inside iffffffffffff');
         elasticSearchClient = new elasticsearch.Client({
             host: [{
                 host: 'localhost',
                 port: '9200',
                 protocol: "https",
                 auth: auth,
                 log: 'trace',
                 requestTimeout: 60000
             }]
 
         });
     }
     else {
        console.log('inside else')
         elasticSearchClient = new elasticsearch.Client({
             host: connstring,
             log: 'trace',
             requestTimeout: 60000
         });
     }
 
    elasticSearchClient.ping({ requestTimeout: 30000, }, function (error) {
        if (error) {
            console.log('Elasticsearch is down :' + error);
        }
        else {
            console.log('Elasicsearch up and running!!')
        }
    });



}

//get profile details
function getData(queryBody, paramIndex) {
    console.log("hello elastic ")
    if (elasticSearchClient == null) {
      connectClient();
      console.log("connect client elastic")
    }
  
    // return new Promise((resolve, reject) => {
    //       elasticSearchClient.search({
    //             index: paramIndex,
    //             body: queryBody
  
    //     }).then((result) => {
    //         //console.log("33333")
    //         log.info('Results: ' + result);
    //         resolve(result)
    //     }).catch((err) => {
    //         //console.log("444444444")
    //         log.error('error: ' + err);
    //         reject(err)
    //     })
    // })
  
    return elasticSearchClient
      .search({
        index: paramIndex,
        body: queryBody,
      })
      .then(function (resp) {
        console.log(resp);
        if (resp.hits.total.value == 0)
          return { statuscode: 404, message: "No such doctor exist" };
        else return resp.hits;
      });
  }
  
  //update Profile Details
  function updateData(paramIndex, Identifier, body) {
    if (elasticSearchClient == null) {
      connectClient();
    }
  
    // return new Promise((resolve, reject) => {
    //       elasticSearchClient.search({
    //             index: paramIndex,
    //             body: queryBody
  
    //     }).then((result) => {
    //         //console.log("33333")
    //         log.info('Results: ' + result);
    //         resolve(result)
    //     }).catch((err) => {
    //         //console.log("444444444")
    //         log.error('error: ' + err);
    //         reject(err)
    //     })
    // })
  
    return elasticSearchClient
      .update({
        index: paramIndex,
        id: Identifier,
        body: {
          doc: body,
        },
      })
      .then(function (resp) {
        if (resp.result == "updated") {
          console.log("Fields successfully updated");
          return resp;
        } else {
          throw {
            statuscode: 400,
            message: "please enter a new Field Value to update ",
          };
        }
      });
  }
  
  function createEntity(object, paramIndex) {
    //  //console.log("Esdb invoked perfectly",object)
    if (elasticSearchClient == null) {
      connectClient();
    }
  
    return new Promise((resolve, reject) => {
      elasticSearchClient
        .index({
          index: paramIndex,
  
          body: object,
        })
        .then((result) => {
          // return { statuscode: 200, message: "Doctor Created Successfully"}
          //console.log("The result is ",result)
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  
    // //console.log("logging data")
    // return elasticSearchClient.index({
    //     index: paramIndex,
    //     document: object
    // }).then(function(resp) {
    //     //console.log("here")
    //   return resp.status(200).json({message:'Doctor profile created successfuly'})
  
    // }).catch(err=>{
    //     return   { statuscode: 404, message: "Doctor profile Creation Failed"}
    // });
  }


  function templateSearch(queryBody, paramIndex, paramsTemplate) {
    if (elasticSearchClient == null) {
        connectClient();
    }
    // paramIndexList = paramIndex.split(',')
    // indexNamesList = []
    // paramIndexList.forEach(element => {
    //     indexNamesList.push(indexDict[element])
    // });
    // indexNames = indexNamesList.join(',')
    // console.log(indexNames)
    queryBody.genderAggregation=true
    console.log(queryBody , "is")
    return new Promise((resolve, reject) => {
        elasticSearchClient.searchTemplate({
            index: paramIndex,
            // type: indexDict[paramType],
            body: {
                "id": paramsTemplate,
                "params": queryBody
            }
        }).then((result) => {
            console.log('Results: ' + result);
            resolve(result)
        }).catch((err) => {
            // log.error('error: ' + err);
            // reject(result)
            console.log("bata bhai" ,err)
        })
    })
}

function aggegrationsData(aggsMetaData){
  aggsDataList = []
  try {
      //console.log(aggsMetaData)
      for(var obj in aggsMetaData){
          if(obj in aggsDisplayName){
              aggsFilter = {
                  "displayName" : "",
                  "type" : "",
                  "content" :[]
              }

              aggsFilter.type = obj.replace("Aggs","")
              aggsFilter.displayName = aggsDisplayName[obj]
              aggsData = aggsMetaData[obj][obj]
              
              //to handle nested aggs case
              if(aggsData.hasOwnProperty(obj)){
                  aggsData = aggsData[obj]
                  
              }
              aggsData = aggsData["buckets"]

              let contentList = []
              if(aggsData.length > 0){
                  for(let value of aggsData){
                      //console.log(value)
                      aggsContent={}

                      //for hasAcceptedAnswerAggs the key from aggs data is 0 or 1 , inorder to show the value as true
                          // or false we use key_as_string field in this case
                      if(obj == "hasAcceptedAnswerAggs"){
                          if(value['key_as_string'] == "false"){
                              aggsContent.displayName = "No"
                          }
                          else{
                              aggsContent.displayName = "Yes"
                          }
                          aggsContent.type = value['key_as_string']
                      }
                      else if(obj == "dtLastModifiedAggs"){
                          aggsContent.displayName = value['key']
                          aggsContent.from = value['from_as_string']
                          aggsContent.to = value['to_as_string']
                      }
                      else{
                          aggsContent.displayName = value['key']
                          aggsContent.type = value['key']
                      }
                      aggsContent.count = value['doc_count']
                      contentList.push(aggsContent)
                  }
              }
              if(contentList.length >0){
                aggsFilter.content = contentList
                aggsDataList.push(aggsFilter)
              }
              
          }
      }
      return aggsDataList
  } catch (error) {
      log.error('error', error)
    throw error.toString()
  }
}
  
  module.exports = {
    getData,
    createEntity,
    updateData,
    templateSearch,
    aggegrationsData
  };
  