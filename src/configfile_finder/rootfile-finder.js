var fs = require('fs');
var path = require('path');
var configfileReader = require('./configfile-reader.js');

module.exports = {
  upwards: upwards,
};

function upwards(fromPath, configFilename) {
  var pathStat = fs.lstatSync(fromPath);

  if(pathStat.isFile()) {
    fromPath = getUpwardsDirectory(fromPath);
  }

  return findConfigfileIn(fromPath, configFilename);
}

function getUpwardsDirectory(fromPath) {
  return path.parse(fromPath).dir;
}

function findConfigfileIn(fromPath, configFilename) {
  var configFilepath = path.format({
      dir: fromPath,
      base: configFilename
  });

  var configFile = configfileReader.readFrom(configFilepath);
  if(configFile && configFile.root) {
    return fromPath;
  } else {
    return keepLookingUpwards(fromPath, configFilename);
  }
}

function keepLookingUpwards(fromPath, configFilename) {
  var nextDirectory = getUpwardsDirectory(fromPath);

  if(nextDirectory) {
    return findConfigfileIn(nextDirectory, configFilename);
  }else {
    throw Error('It was not able to find a file named ' + configFilename + ' in any upwards directory.');
  }
}
