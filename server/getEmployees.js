const fetch = require('node-fetch');
const url = 'https://knowthyneighbor.herokuapp.com/api/neighbors';

module.exports = getEmployees = (req, res) => fetch(url)
  .then(response => response.json())
  .then(employees => res.send(employees))
  .catch(error => console.error('Error retrieving employees', error));
