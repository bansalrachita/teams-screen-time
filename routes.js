const fetch = require('node-fetch');

module.exports.setup = function (app) {
  var path = require('path');
  var express = require('express');
  // Use the JSON middleware
  app.use(express.json());

  try {
    // resolve absolute path to the static bundle files.
    app.use(express.static(path.resolve(__dirname, './build')));

    // send the user to index html page inspite of the url
    app.get('/tab', (req, res) => {
      res.sendFile(path.resolve(__dirname, './build/index.html'));
    });

    console.info(`Serving client from ${process.env.NODE_ENV} build.`);
  } catch (error) {
    console.error(
      `Couldn't server client in ${process.env.NODE_ENV} environment.`
    );
  }

  // Security: whitelist same origin request in the browser
  // for service deployed in production.
  app.use(function (req, res, next) {
    const host =
      process.env.NODE_ENV === 'development'
        ? '*'
        : process.env.REACT_APP_API_URL + ':' + process.env.REACT_APP_API_PORT;
    res.header('Access-Control-Allow-Origin', host);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });

  // On-behalf-of token exchange
  app.post('/auth/token', function (req, response) {
    const tid = req.body.tid;
    const token = req.body.token;
    const scopes = ['https://graph.microsoft.com/User.Read'];

    const oboPromise = new Promise((res, rej) => {
      const url =
        'https://login.microsoftonline.com/' + tid + '/oauth2/v2.0/token';
      const params = {
        client_id: process.env.REACT_APP_CLIENT_APP_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
        requested_token_use: 'on_behalf_of',
        scope: scopes.join(' '),
      };

      fetch(url, {
        method: 'POST',
        body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}&assertion=${token}&requested_token_use=${params.requested_token_use}&scope=${params.scope}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }).then((result) => {
        if (result.status !== 200) {
          result.json().then((json) => {
            rej({ message: json.error, status: result.status });
          });
        } else {
          result.json().then((json) => {
            res(json.access_token);
          });
        }
      });
    });
    oboPromise.then(
      function (result) {
        response.json(result);
      },
      function (error) {
        console.log(error); // Error: "It broke"
        response.status(error.status).json({ error: error.message });
      }
    );
  });
};
