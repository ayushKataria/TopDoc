const elasticsearch = require('elasticsearch');
const { json } = require('express');

let elasticSearchClient=null
//Akash Elastic pass

 var auth = 'elastic' + ":" + 'prMQZkpxu8he__rgcCgR'
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
  
    return new Promise((resolve, reject) => {
          elasticSearchClient.search({
                index: paramIndex,
                body: queryBody
  
        }).then((result) => {
            // log.info('Results: ' + result);
            resolve(result)
        }).catch((err) => {
            // log.error('error: ' + err);
            reject(err)
        });
    });
  
    // return elasticSearchClient
    //   .search({
    //     index: paramIndex,
    //     body: queryBody,
    //   })
    //   .then(function (resp) {
    //     console.log(resp);
    //     if (resp.hits.total.value == 0)
          // return { statuscode: 404, message: "No such doctor exist" };
    //     else return resp.hits;
    //   });
  }
  
  //update Profile Details
  function updateData(paramIndex, Identifier, body) {
    if (elasticSearchClient == null) {
      connectClient();
    }
  
    // return new Promise((resolve, reject) => {
    //       elasticSearchClient.search({
    //             index: paramIndex,
    //             id: Identifier,
    //             body: {
        //   doc: body,
        // },
  
    //     }).then((result) => {
    //         log.info('Results: ' + result);
    //         resolve(result)
    //     }).catch((err) => {
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
          console.log(resp)
          console.log("Fields successfully updated");
          return resp;
        } else {
          throw err
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
          id:object.id,
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
    console.log("Template Search called")
    if (elasticSearchClient == null) {
        connectClient();
    }
    console.log("Template Search 2 called")
    // paramIndexList = paramIndex.split(',')
    // indexNamesList = []
    // paramIndexList.forEach(element => {
    //     indexNamesList.push(indexDict[element])
    // });
    // indexNames = indexNamesList.join(',')
    // console.log(indexNames)

    // temporay code starts
  //  queryBody.genderAggregation=true
  //  queryBody.averageRatingAggregation=true,
  //  queryBody.averageRatingAggregationComma=true,
  //     queryBody.languagesAggregation=true,
  //   queryBody.languagesAggregationComma=true,
  //   queryBody.specializationAggregation=true,
  //   queryBody.specializationAggregationComma=true,
  //   queryBody.cityAggregation=true,
  //   queryBody.cityAggregationComma=true,
  //   queryBody.countryAggregation=true,
  //   queryBody.countryAggregationComma=true,
  //   queryBody.yearsOfExperienceAggregation=true,
  //   queryBody.yearsOfExperienceAggregationComma=true
  // temporay code sends
    console.log("ssssssssssqueryBody is",queryBody )
    return new Promise((resolve, reject) => {
        elasticSearchClient.searchTemplate({
            index: paramIndex,
            // type: indexDict[paramType],
            body: {
                "id": paramsTemplate,
                "params": queryBody
            }
        }).then((result) => {
            console.log('Results: ' + JSON.stringify(result));
            resolve(result)
        }).catch((err) => {
            // log.error('error: ' + err);
            reject(result)
            console.log("bata bhai" ,err)
        })
    })
}
const aggsDisplayName = {
  "cityAggs": "Cities",
  "languagesAggs" : "Languages",
  "specializationAggs" : "Specialization",
  "genderAggs" : "Gender",
  "countryAggs" : "Countries",
  "yearsOfExperienceAggs" : "Experience",
  "averageRatingAggs":"Rating"
}
function aggegrationsData(aggsMetaData){
  delete aggsMetaData.doc_count
  console.log("Aggregation data func called",aggsMetaData)
  aggsDataList = []
  try {
      //console.log(aggsMetaData)

     
      for(var obj in aggsMetaData){
        console.log("obj is ",obj)
        if(obj in aggsDisplayName){
          aggsFilter = {
              "displayName" : "",
              "type" : "",
              "content" :[]
          }

          aggsFilter.type = obj.replace("Aggs","")
          aggsFilter.displayName = aggsDisplayName[obj]
          aggsData = aggsMetaData[obj][obj]
        //  console.log("Aggs meta data is ",aggsData)
        //  console.log("agsfilter is ",aggsFilter)
           //to handle nested aggs case
           if(aggsData.hasOwnProperty(obj)){
            aggsData = aggsData[obj]
            
        }
        aggsData = aggsData["buckets"]
//onsole.log("AggsData is ",aggsData)
        let contentList = []
        if(aggsData.length > 0){
            for(let value of aggsData){
               // console.log("vaslue in aggs adata is",value)
                aggsContent={}

                //creating content for average rating
                if(obj == "averageRatingAggs"){ // Rating aggs

                  aggsContent.displayName=value.key
                  aggsContent.from=value.from
                  aggsContent.to=value.to
                  aggsContent.count=value.doc_count


             
             
              }
              else if(obj =='genderAggs'){  //gender aggregations
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              }
              else if(obj=='languagesAggs'){  //Language aggregations
                console.log("Value in lang is ",value)
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              } else if(obj=='cityAggs'){  //city aggregations
                console.log("Value in lang is ",value)
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              } else if(obj=='specializationAggs'){  //Specialization aggregations
                console.log("Value in specis  is ",value)
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              }else if(obj=='countryAggs'){  //Countyr aggregations
                console.log("Value in country i  is ",value)
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              }else if(obj=='yearsOfExperienceAggs'){  //Experience aggregations
                console.log("Value in country i  is ",value)
                aggsContent={}

                //creating content for average rating
                
                  aggsContent.displayName=value.key
               //   aggsContent.from=value.from
//aggsContent.to=value.to
                  aggsContent.count=value.doc_count
                          
              }else{
                aggsContent.displayName = value['key']
                aggsContent.type = value['key']
            }

              aggsContent.count = value['doc_count']
              contentList.push(aggsContent)
              
           
            }
         
        }
        if(contentList.length >0){
          aggsFilter.content = contentList
          console.log("Aggs filter to be pushed is ",aggsFilter)
          aggsDataList.push(aggsFilter)
        }
        
        
       
  }
 

}
console.log("aggsDataList is ",JSON.stringify(aggsDataList))
return aggsDataList
}catch (error) {
      log.error('error', error)
    throw error.toString()
  }
}
  
  module.exports = {
    getData,
    createEntity,
    updateData,
    templateSearch,
    aggegrationsData,
    connectClient
  };
  