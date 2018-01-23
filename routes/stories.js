var express = require('express');
var axios = require('axios');
var circularJson = require('circular-json');
var router = express.Router();
var config = require('../config');
var _ = require('underscore');


/* GET users listing. */
 router.get('/', function(req, res, next) {

  function getUsers() {
    return axios.get( 
         config.TRACKER_API_BASE_URL + '/projects/' + config.PROJECT_IDS.astronaut + "/memberships", {
         headers: {
             'X-TrackerToken': config.TRACKER_API_TOKEN
             }
         });
 }
 
 function getStories() {
     return axios.get( 
         config.TRACKER_API_BASE_URL + '/projects/' + config.PROJECT_IDS.astronaut + '/stories?with_state=started', {
         headers: {
           'X-TrackerToken': config.TRACKER_API_TOKEN
          }
        });
 }

  axios.all([getUsers(), getStories()])
   .then(axios.spread((usersResponse, storiesResponse) => {
    let filteredUserResponseData = _.filter(usersResponse.data, (person) => {
      return person["role"] === "member"   
     }); 
    
    var usersIndexedByName = {};

     filteredUserResponseData.forEach(membership => {
      usersIndexedByName[membership.id] = membership.person.name
     })

     storiesResponse.data.forEach(story => {
       let ownerNames = []
       story.owner_ids.forEach(id => {
         ownerNames.push(usersIndexedByName[id]);
       });
       console.log(ownerNames);
       story["owners"] = ownerNames
     });

      res.json(JSON.parse(circularJson.stringify(storiesResponse.data)));
   }));

  //  axios.get( 
  //    config.TRACKER_API_BASE_URL + '/projects/' + config.PROJECT_IDS.astronaut + '/stories?with_state=started', {
  //    headers: {
  //      'X-TrackerToken': config.TRACKER_API_TOKEN
  //     }
  //   })
  //       .then((response) => {
  //         res.set('Content-Type', 'application/json');
  //         res.set('Access-Control-Allow-Origin', '*');
  //         res.json(JSON.parse(circularJson.stringify(response.data)));
  //    }) 
  });

module.exports = router;
