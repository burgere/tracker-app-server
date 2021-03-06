var express = require('express');
var axios = require('axios');
var _ = require('underscore');
var circularJson = require('circular-json');
var router = express.Router();
var config = require('../config');

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

     function retrieveStoriesByUser(userId, stories) {
         return _.filter(stories, (story) => {
             return story.owner_ids.includes(userId)
         });
     }
    
    axios.all([getUsers(), getStories()])
        .then(axios.spread((usersResponse, storiesResponse) => {
            let users = []
            let filteredUserResponseData = _.filter(usersResponse.data, (person) => {
                return person["role"] === "member"  
            });

            for(var i = 0; i < filteredUserResponseData.length; i++) {
                users.push({
                    key: filteredUserResponseData[i].person.name,
                    user_id: filteredUserResponseData[i].person.id,
                    stories: retrieveStoriesByUser(filteredUserResponseData[i].person.id, storiesResponse.data)
                });
            }

            let usersWithStories = _.filter(users, (user) => {
                return user.stories.length > 0
            });

            res.json(JSON.parse(circularJson.stringify(usersWithStories)));

    }))

//      .then((response) => {
    //    res.set('Content-Type', 'application/json');
    //    res.set('Access-Control-Allow-Origin', '*');
    //    let responseData = response.data;
    //    let filteredResponseData = _.filter(responseData, (person) => {
    //      return person["role"] === "member"
    //    })  

    //    res.json(JSON.parse(
    //        circularJson.stringify(filteredResponseData)
    //      ));
//   }) 
});

module.exports = router;
