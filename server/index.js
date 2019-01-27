require('dotenv').config();

const { makeGetRequest } = require('./lib/request');

const TOGGL_API_TOKEN = process.env.toggl_api_token;

makeGetRequest({
  host: 'toggl.com',
  path: '/reports/api/v2/weekly?user_agent=chrstnst&workspace_id=3154506',
  auth: `${TOGGL_API_TOKEN}:api_token`,
  headers: {
    'Content-Type': 'application/json',
  },
}).then(console.log, console.error);
