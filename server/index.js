const express = require('express');
const app = express();
const port = 4000;
const getEmployees = require('./getEmployees');

app
  .use(express.static(__dirname + '/../public_html/'))
  .get('/api', getEmployees)
  .listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
