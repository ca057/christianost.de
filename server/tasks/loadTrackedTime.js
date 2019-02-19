const got = require('got');

const { interpolateLinear } = require('./../lib/interpolate');
const { conditionallyRetryAsync, delay } = require('./../lib/asyncHelpers');

const TOGGL_API_TOKEN = process.env.toggl_api_token;
const TOGGL_API_USER_AGENT = process.env.toggl_api_user_agent;

const currentYear = new Date().getFullYear();

const getTrackedTimePaginated = ({ page, workspaceId }) =>
  got(
    `https://toggl.com/reports/api/v2/details?user_agent=${TOGGL_API_USER_AGENT}&workspace_id=${workspaceId}&since=${currentYear}-01-01&page=${page}`,
    { auth: `${TOGGL_API_TOKEN}:api_token` },
  )
    .then(response => JSON.parse(response.body))
    .catch(() => []);

const getTrackedTimeUntilEmpty = ({ workspaceId }) => {
  let allEntries = [];
  let page = 0;

  const task = () => {
    page += 1;
    return delay(1000).then(() =>
      getTrackedTimePaginated({ page, workspaceId }).then(result => {
        allEntries = allEntries.concat(...result.data);
        return result;
      }),
    );
  };

  const conditionCheck = result =>
    result && result.data && result.data.length > 0;

  return conditionallyRetryAsync(task, conditionCheck).then(() => allEntries);
};

const loadTrackedTime = ({ workspaceId }) =>
  getTrackedTimeUntilEmpty({ workspaceId })
    .then(details => {
      const timeEntries = details.map(({ id, dur, start, end }) => ({
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

      return {
        lines: perDay.map(data => ({
          ...data,
          value: normalizeValue(data.value),
        })),
      };
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

module.exports = { loadTrackedTime };
