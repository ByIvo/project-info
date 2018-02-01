var fs = require('fs');
var path = require('path');
var configfileReader = require('./configfile-reader.js');

module.exports = {
  upwards: upwards,
};

function upwards(fromPath, configFilename) {
  var pathStat = fs.lstatSync(fromPath);

  if(pathStat.isFile()) {
    fromPath = getUpwardsDirectory(fromPath).dir;
  }

  return findConfigfileIn(fromPath, configFilename);
}

function getUpwardsDirectory(fromPath) {
  return path.parse(fromPath);
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
  var upwardsParsed = getUpwardsDirectory(fromPath);

  var nextDirectory = upwardsParsed.dir;
  var rootFilesystemPath = upwardsParsed.root;

  if(nextDirectory !== rootFilesystemPath) {
    return findConfigfileIn(nextDirectory, configFilename);
  } else {
    throw Error('It was not able to find a file named ' + configFilename + ' in any upwards directory.');
  }
}
