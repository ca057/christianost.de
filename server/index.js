require('dotenv').config();
const got = require('got');

const TOGGL_API_TOKEN = process.env.toggl_api_token;
const TOGGL_WORKSPACE_ID = process.env.toggl_workspace_id;
const TOGGL_API_USER_AGENT = process.env.toggl_api_user_agent;

// TODO: make it based on the current year
got(
  `https://toggl.com/reports/api/v2/details?user_agent=${TOGGL_API_USER_AGENT}&workspace_id=${TOGGL_WORKSPACE_ID}&since=2019-01-01&until=2019-12-31&perpage=1500`,
  { auth: `${TOGGL_API_TOKEN}:api_token` },
)
  .then(response => {
    const details = JSON.parse(response.body);

    const timeEntries = details.data.map(({ id, dur, start, end }) => ({
      id,
      dur,
      start,
      end,
    }));

    const groupedByDay = timeEntries.reduce((accum, curr) => {
      const date = curr.start.split('T')[0];
      if (accum[date]) {
        accum[date] = [...accum[date], curr];
      } else {
        accum[date] = [curr];
      }
      return accum;
    }, {});

    const perDay = Object.keys(groupedByDay).reduce((accum, key) => {
      accum[key] = {
        dur: groupedByDay[key].reduce((result, curr) => result + curr.dur, 0),
      };
      return accum;
    }, {});
    console.log(perDay);
  })
  .catch(console.error);
