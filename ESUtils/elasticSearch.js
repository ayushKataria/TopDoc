const elasticsearch = require('elasticsearch');
const { json } = require('express');

let elasticSearchClient=null
//Akash Elastic pass
 var auth = 'elastic' + ":" + 'cmlflG69YzfuZMgN=DUb'
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
          return {
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
    return new Promise((resolve, reject) => {
        elasticSearchClient.searchTemplate({
            index: paramIndex,
            // type: indexDict[paramType],
            body: {
                "id": paramsTemplate,
                "params": queryBody
            }
        }).then((result) => {
            // log.info('Results: ' + result);
            resolve(result)
        }).catch((err) => {
            // log.error('error: ' + err);
            // reject(result)
            console.log("bata bhai" ,err)
        })
    })
}
  
  module.exports = {
    getData,
    createEntity,
    updateData,
    templateSearch
  };
  