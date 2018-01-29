var express = require('express');
var axios = require('axios');
var circularJson = require('circular-json');
var router = express.Router();
var config = require('../config');
var _ = require('underscore');

/* GET users listing. */
 router.get('/', function(req, res, next) {

  axios.all([getUsers(), getStories()])
   .then(axios.spread((usersResponse, storiesResponse) => {

    let usersIndexedById = buildIndexedListOfUsers(usersResponse.data);

    storiesResponse.data.forEach(story => {

      let storyOwnerUserNames = [];
      story.owner_ids.forEach(id => {
        storyOwnerUserNames.push(usersIndexedById[id]);
      });
      story.usernames = storyOwnerUserNames;
    });
      
      res.set('Content-Type', 'application/json');
      res.set('Access-Control-Allow-Origin', '*');
      res.json(JSON.parse(circularJson.stringify(storiesResponse.data)));
  }));
});

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

 function buildIndexedListOfUsers(userData) {
  let filteredUserResponseData = _.filter(userData, (person) => {
    return person["role"] === "member" || person["role"] === "owner"   
   }); 

   let userNames = _.map(filteredUserResponseData, (membership) => {
     return membership.person.name;
   })

   let userIds = _.map(filteredUserResponseData, (membership) => {
     return membership.person.id;
   })

   let finalList = _.object(userIds, userNames);
   return finalList;
 }


module.exports = router;
