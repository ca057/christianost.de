const http = require('http');

const makeGetRequest = async (options = {}) =>
  new Promise((resolve, reject) => {
    http.get(options, response => {
      let body = '';
      response.on('data', data => {
        body += data;
      });

      response.on('error', error => reject(error));

      response.on('end', () => {
        try {
          console.log(body);
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
  });

module.exports = { makeGetRequest };
