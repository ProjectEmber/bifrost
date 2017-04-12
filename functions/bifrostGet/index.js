'use strict';

// including AWS SDK
const AWS = require('aws-sdk');
// including Elasticsearch SDK
const Elasticsearch = require('elasticsearch');

// retrieving handlers
exports.handler = (event, context, callback) => {

    // done callback implementing API protocol 
    const done = (err, res) => callback(null, {
        version: event.version,
        code: err ? '0' : '1',
        msg: err ? err.message : res,
        data: null,
    });

}