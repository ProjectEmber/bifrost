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
        msg: err ? err.message : "success",
        data: res,
    });

    // creating elasticsearch client
    // (replace host with your elasticsearch cluster address!)
    var client = new elasticsearch.Client({
        host: 'db.project-ember.city:9200',
        log: 'trace'
    });

    // initializing search type
    var searchtype = null;
    var search = null;
    try {
        // check for events params to perform the search
        searchtype = event.type;
        search = event.search;
    } catch (error) {
        // error retrieving params
        done(new Error("Error parsing parameters"), null);
    }
    
    // consistency check on type - it must be 
    // 'city' -> perform search on city returning the list of all the CUs
    // 'area' -> geo query according the area
    if (searchtype === null || typeof searchtype !== "string")
        done(new Error("Error in type field"), null);
    
    // initializing query
    var queryobj = null;

    // QUERY BY CITY
    if (searchtype == "city") {
        // searching by city in the control units collection
        queryobj = {
            match: { city: search }
        };
    }

    // QUERY BY NAME
    if (searchtype == "name") {
        // searching by name in the control units collection
        // (for example it can be the address)
        queryobj = {
            match: { name: search }
        };
    }

    // QUERY BY AREA
    if (searchtype == "area") {
        // searchinb by area using coordinates and geoquery
        try {
            queryobj = {
                geo_bounding_box: {
                    location: {
                        top_left: { 
                            lat: search.top_left.lat,
                            lon: search.top_left.lon
                        },
                        bottom_right: {
                            lat: search.bottom_right.lat,
                            lon: search.bottom_right.lon
                        }
                    }
                }
            };
        } catch (error) {
           done(new Error("Error parsing coordinates"), null);
        }
    }

    // cannot creay any query ... 
    else 
        done(new Error("Error in type field - '" + searchtype + "' is not a proper parameter"), null);

    // SEARCH into Elasticsearch
    client.search(
        {
            index: 'ember',
            type: 'control_units',
            body: {
                from: 0,
                size: 10000,
                query: queryobj
            }
        }
    ).then(function (resp) {
        // collecting results using a properly formatted array
        var data = []
        resp.hits.hits.forEach( function(hit) {
            data.push({
                 cu_name: hit._source.name,
                 cu_ip: hit._source.ip
            });
        });
        // returning results
        done(null, data);
    }, function(err) {
        // returning error
        done(new Error(err.message), null);
    } );
}