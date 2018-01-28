var configfileFinder = require('./configfile_finder/configfile-finder.js');
var rootfileFinder = require('./configfile_finder/rootfile-finder.js');

module.exports = {
  create: create
};

function create(path, configFilename) {
  var rootfilePath = rootfileFinder.upwards(path, configFilename);
  return configfileFinder.from(rootfilePath, configFilename);
}
