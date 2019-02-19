// const retryAsync = (times, task) => {
//   if (!task || typeof task !== 'function' || times < 0) {
//     throw new TypeError(
//       'No task passed or task is not of type function or times is a negative value.',
//     );
//   }

//   return new Promise(async (resolve, reject) => {
//     for (let i = 0; i < times; i++) {
//       try {
//         const result = await task();
//         resolve(result);
//         break;
//       } catch (error) {
//         if (i === times - 1) {
//           reject(error);
//         }
//       }
//     }
//   });
// };

const conditionallyRetryAsync = async (task, conditionCheck) => {
  let lastResult = null;
  do {
    lastResult = await task(); // eslint-disable-line no-await-in-loop
  } while (conditionCheck(lastResult));

  return lastResult;
};

module.exports = { conditionallyRetryAsync };
