require('dotenv').config();
const got = require('got');

const { interpolateLinear } = require('./lib/interpolate');
const { writeToFile } = require('./lib/files');

const TOGGL_API_TOKEN = process.env.toggl_api_token;
const TOGGL_WORKSPACE_ID = process.env.toggl_workspace_id;
const TOGGL_API_USER_AGENT = process.env.toggl_api_user_agent;
const DATA_FILE_PATH = process.env.data_file_path;

const currentYear = new Date().getFullYear();

got(
  `https://toggl.com/reports/api/v2/details?user_agent=${TOGGL_API_USER_AGENT}&workspace_id=${TOGGL_WORKSPACE_ID}&since=${currentYear}-01-01&until=${currentYear}-12-31&perpage=1500`,
  { auth: `${TOGGL_API_TOKEN}:api_token` },
)
  .then(async response => {
    const details = JSON.parse(response.body) || {};

    const timeEntries = (details.data || []).map(({ id, dur, start, end }) => ({
      id,
      dur,
      start,
      end,
    }));

    const groupedByDay = timeEntries.reduce((accum, curr) => {
      const date = curr.start.split('T')[0];

      // eslint-disable-next-line no-param-reassign
      accum[date] = accum[date] ? [...accum[date], curr] : [curr];

      return accum;
    }, {});

    const perDay = Object.keys(groupedByDay).reduce(
      (accum, key) => [
        ...accum,
        {
          value: groupedByDay[key].reduce(
            (result, curr) => result + curr.dur,
            0,
          ),
        },
      ],
      [],
    );

    const durations = Object.values(perDay).map(entry => entry.value);
    const maxEntry = Math.max(...durations);
    const minEntry = Math.min(...durations);

    const normalizeValue = interpolateLinear([minEntry, maxEntry], [0, 1]);

    console.log(
      perDay.map(data => ({
        ...data,
        value: normalizeValue(data.value),
      })),
    );
    // await writeToFile('', {}, {});
  })
  .catch(console.error);
