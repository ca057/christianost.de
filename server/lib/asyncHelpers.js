const delay = delayInMs =>
  new Promise(resolve => setTimeout(resolve, delayInMs));

const conditionallyRetryAsync = async (task, conditionCheck) => {
  let lastResult = null;
  do {
    lastResult = await task(); // eslint-disable-line no-await-in-loop
  } while (conditionCheck(lastResult));

  return lastResult;
};

module.exports = { conditionallyRetryAsync, delay };
