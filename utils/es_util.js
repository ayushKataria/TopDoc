"use strict";
const { Client } = require("@elastic/elasticsearch");
const properties_util = require("./properties_util");

let esClient = null;

async function setClient() {
  esClient = new Client({
    node: properties_util.esServer,
    auth: {
      username: properties_util.esUserName,
      password: properties_util.esPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function ping() {
  if (!esClient) {
    setClient();
  }
  return esClient.ping();
}

async function getById(index, id) {
  if (!esClient) {
    setClient();
  }
  return esClient.get({
    index: index,
    id: id,
  });
}

async function search(queryBody, indexName) {
  if (!esClient) {
    setClient();
  }

  return esClient.search({
    index: indexName,
    body: queryBody,
  });
}

//update Profile Details
function update(indexName, identifier, body) {
  if (!esClient) {
    setClient();
  }

  return esClient.update({
    index: indexName,
    id: identifier,
    body: {
      doc: body,
    },
  });
}

function insert(object, identifier, indexName) {
  if (!esClient) {
    setClient();
  }

  return esClient.index({
    id: identifier,
    index: indexName,
    body: object,
  });
}

function templateSearch(queryBody, indexName, templateName) {
  if (!esClient) {
    setClient();
  }

  return esClient.searchTemplate({
    index: indexName,
    body: {
      id: templateName,
      params: queryBody,
    },
  });
}

async function searchAll(queryBody, indexName) {
  if (!esClient) {
    setClient();
  }

  return esClient.search({
    index: indexName,
    query: queryBody,
  });
}
module.exports = {
  ping,
  getById,
  search,
  update,
  insert,
  templateSearch,
  searchAll,
};
