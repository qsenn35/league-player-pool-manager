const { generateBootcampTeams } = require('./bootcampSort/index.js');
const { generateCustomsTeams } = require('./customsSort/index.js');
const { generateRandomTeams } = require('./randomSort/index.js');

module.exports = {
  generateRandomTeams,
  generateBootcampTeams,
  generateCustomsTeams,
}