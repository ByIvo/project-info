var fs = require('fs');
var propertiesCreator = require('./properties-creator.js');

module.exports = {
  from: from
};

function from (path, configFilename) {
  var validPath = fs.existsSync(path);
  configFilename = configFilename || '.project.info.json';

  if(!validPath) {
    throw Error('Path "' + path + '" does not exists!');
  }

  return propertiesCreator.create(path, configFilename);
}
