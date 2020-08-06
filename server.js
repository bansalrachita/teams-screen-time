const express = require('express');
const app = express();
const routes = require('./routes');

routes.setup(app);

var port = process.env.REACT_APP_API_PORT || 3000;

app.listen(port, function () {
  console.info('App listening on port ', port);
});
