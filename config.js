const config = {
    TRACKER_API_BASE_URL: "https://www.pivotaltracker.com/services/v5/",
    PROJECT_IDS: {
        astronaut: "1991497"
    },
    TRACKER_API_TOKEN: process.env.PIVOTAL_TRACKER_API_TOKEN
}

module.exports = config