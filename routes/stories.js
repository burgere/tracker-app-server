var express = require('express');
var axios = require('axios');
var circularJson = require('circular-json');
var router = express.Router();
var config = require('../config');


/* GET users listing. */
 router.get('/', function(req, res, next) {
   
   axios.get( 
     config.TRACKER_API_BASE_URL + '/projects/' + config.PROJECT_IDS.astronaut + '/stories?with_state=started', {
     headers: {
       'X-TrackerToken': config.TRACKER_API_TOKEN
      }
    })
        .then((response) => {
          res.json(circularJson.stringify(response))
     }) 
  });

module.exports = router;