'use strict'
const { Client } = require('@elastic/elasticsearch')
const properties_util = require('./properties_util')

let esClient = null

async function setClient() {
    esClient = new Client({
        node: properties_util.esServer,
        auth: {
            username: properties_util.esUserName,
            password: properties_util.esPassword
        },
        tls: { 
          rejectUnauthorized: false
        }
    })
}

async function ping() {
    if(!esClient) {
        setClient()
    }
    return esClient.ping()
}

async function getById(index, id) {
    if(!esClient) {
        setClient()
    }
    return esClient.get({
        index: index,
        id: id
    })
}

module.exports = {
    ping,
    getById
}