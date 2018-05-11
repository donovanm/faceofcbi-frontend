const fetch = require('node-fetch');
const url = 'https://d923e54a54795d4c11212e3ea91b0e5e7725d602:x@api.bamboohr.com/api/gateway.php/cbinsights/v1/employees/directory';

module.exports = getEmployees = (req, res) => fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
})
.then(response => response.text())
.then(results => res.send(results.employees))
.catch(error => console.error('Error retrieving employees', error));
