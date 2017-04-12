# Bifrost
Project Ember control units unified API (for AWS Lambda)

## Usage
These functions are a blueprint and a concept to implement a root directory to collect and unify the retrieval of the control units which are 
into the Project Ember grid. Please remember to upload a zip updated with your specific Elasticsearch cluster host address into your AWS Lambda function. You can also specify the body mapping using the templates provided to provision via AWS API Gateway and generate your very own SDK.

Please note that the directory is built to be flexible: use as your CU name the address where it is located and search by such a name to have backward compatibility with a city grid, or use an alphanumeric identifier for general purpose solutions. 

The API methods follow.


### SEARCH 
| LAMBDA | `indexSearch.js`           |
|--------|----------------------------|
| Method | `POST`                     |
| Path   | `<api_root>/ember_cu_directory/search`|

Use this API to search a control unit specifying if you are search by city, by address or by area.
#### by CITY
Post the following JSON to retrieve a list of all the control units in the city specified:
```javascript
    {
        type: "city",
        search: "<city_name>"
    }
```

#### by NAME
Post the following JSON to retrieve a list of all the control units using the name (address) specified:
```javascript
    {
        type: "name",
        search: "<cu_name>"
    }
```

#### by AREA
Post the following JSON to retrieve a list of all the control units in the area specified by the rectangle which area is defined in the 'search' parameter:
```javascript
    {
        type: "area",
        search: {
            top_left: {
                lat: "<lat>",
                lon: "<lon>",
            },
            bottom_right: {
                lat: "<lat>",
                lon: "<lon>",
            }
        }
    }
```

### PUT 
| LAMBDA | `indexPut.js`              |
|--------|----------------------------|
| Method | `POST`                     |
| Path   | `<api_root>/ember_cu_directory/put`|

Use this API to create a new contro unit into the directory.
Post the following JSON to create a proper record:
```javascript
    {
        id:    "<cu_numeric_identifier>",
        name:  "<cu_address>",
        ip:    "<cu_ip_address:port>",
        location: {
            lat: "<cu_latitude>"
            lon: "<cu_longitude>"
        }
    }
```

