var express = require('express');
var axios = require('axios');
var _ = require('underscore');
var circularJson = require('circular-json');
var router = express.Router();
var config = require('../config');



/* GET users listing. */
 router.get('/', function(req, res, next) {
   
   axios.get( 
     config.TRACKER_API_BASE_URL + '/projects/' + config.PROJECT_IDS.astronaut + "/memberships", {
     headers: {
       'X-TrackerToken': config.TRACKER_API_TOKEN
      }
    })
        .then((response) => {
          res.set('Content-Type', 'application/json');
          res.set('Access-Control-Allow-Origin', '*');
          let responseData = response.data;
          let filteredResponseData = _.filter(responseData, (person) => {
            return person["role"] === "member"
          })  

          res.json(JSON.parse(
              circularJson.stringify(filteredResponseData)
            ));
     }) 
  });

module.exports = router;
