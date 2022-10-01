const elasticsearch = require("elasticsearch");
const { response } = require("express");

let elasticSearchClient = null;

const indexDict = {
  user: "user",
};
//Akash Elastic pass

var auth = "elastic" + ":" + "#Optional@9i";

const connstring = "https://" + "localhost" + ":" + "9200";
const enable_password = true;
function connectClient() {
  if (enable_password == true) {
    console.log("inside iffffffffffff");
    elasticSearchClient = new elasticsearch.Client({
      host: [
        {
          host: "localhost",
          port: "9200",
          protocol: "https",
          auth: auth,
          log: "trace",
          requestTimeout: 60000,
        },
      ],
    });
  } else {
    console.log("inside else");
    elasticSearchClient = new elasticsearch.Client({
      host: connstring,
      log: "trace",
      requestTimeout: 60000,
    });
  }

  elasticSearchClient.ping({ requestTimeout: 30000 }, function (error) {
    if (error) {
      console.log("Elasticsearch is down :" + error);
    } else {
      console.log("Elasicsearch up and running!!");
    }
  });
}

async function getData(queryBody, paramIndex, filterpath = "", retry = 0) {
  //console.log("index : ",indexDict[paramIndex])
  //console.log("Type : ",indexDict[paramType])
  //console.log("elasticSearchClient ",elasticSearchClient)
  if (elasticSearchClient == null) {
    console.log("123abcj");
    connectClient();
    console.log("connection established");
  }
  return new Promise((resolve, reject) => {
    elasticSearchClient
      .search({
        index: indexDict[paramIndex],
        filter_path: filterpath,
        body: queryBody,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((error) => {
    if (retry <= 0) {
      throw {
        statuscode: 500,
        err: "Elasticsearch Query failed",
        message: "couldn't query the database",
      };
    } else {
      return getData(queryBody, paramIndex, filterpath, Number(retry - 1));
    }
  });
}

async function updateData(queryBody, paramIndex, retry = 0) {
  if (elasticSearchClient == null) {
    connectClient();
  }
  if (queryBody.hasOwnProperty("body") && queryBody.body.hasOwnProperty("doc"))
    return new Promise((resolve, reject) => {
      elasticSearchClient
        .update({
          index: indexDict[paramIndex],
          id: queryBody.id,
          refresh: "true",
          retry_on_conflict: 2,
          doc_as_upsert: true,
          body: queryBody.body,
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }).catch((err) => {
      if (retry <= 0) {
        throw {
          statuscode: 500,
          err: "Elasticsearch Query failed",
          message: "couldn't query the database",
        };
      } else {
        return updateData(queryBody, paramIndex, Number(retry - 1));
      }
    });
  else {
    return new Promise((resolve, reject) => {
      elasticSearchClient
        .update({
          index: indexDict[paramIndex],
          id: queryBody.id,
          refresh: "true",
          retry_on_conflict: 2,
          body: queryBody.body,
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }).catch((err) => {
      if (retry <= 0) {
        throw {
          statuscode: 500,
          err: "Elasticsearch Query failed",
          message: "couldn't query the database",
        };
      } else {
        return updateData(queryBody, paramIndex, Number(retry - 1));
      }
    });
  }
}

async function updateDataByQuery(queryBody, paramIndex, retry = 0) {
  if (elasticSearchClient == null) {
    connectClient();
  }

  return new Promise((resolve, reject) => {
    elasticSearchClient
      .updateByQuery({
        index: indexDict[paramIndex],
        refresh: "true",
        body: queryBody,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  }).catch((err) => {
    if (retry <= 0) {
      throw {
        statuscode: 500,
        err: "Elasticsearch Query failed",
        message: "couldn't query the database",
      };
    } else {
      return updateDataByQuery(queryBody, paramIndex, Number(retry - 1));
    }
  });
}

module.exports = {
  getData,
  updateData,
  updateDataByQuery,
  connectClient,
};
