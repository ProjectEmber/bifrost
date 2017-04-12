'use strict';

// including AWS SDK
const AWS = require('aws-sdk');
// including Elasticsearch SDK
const elasticsearch = require('elasticsearch');

// retrieving handlers
exports.handler = (event, context, callback) => {

    // done callback implementing API protocol 
    const done = (err, res) => callback(null, {
        version: event.version,
        code: err ? '0' : '1',
        msg: err ? err.message : res,
        data: null,
    });

    // creating elasticsearch client
    // (replace host with your elasticsearch cluster address!)
    var client = new elasticsearch.Client({
        host: 'db.project-ember.city:9200',
        log: 'trace'
    });
    
    // parsing parameters sent via post
    var new_cu = null;
    try {
        new_cu = {
            id:       event.id,
            body : {
                name:     event.name,
                ip:       event.ip,
                location: [
                    event.location.longitude,
                    event.location.latitude
                ]
            }
        };
    } catch (error) {
        done(new Error("Error parsing parameters"), null);
    }

    // performing index operation
    client.index(
        {
            index: 'ember',
            type:  'control_unit',
            id:    new_cu.id,
            body:  new_cu.body
        }
    ).then(function(err) {
        // returning error if any
        if (err) 
            done(new Error(err.message), null);
        // returning true if not
        else
            done(null, true)
    });
    
}