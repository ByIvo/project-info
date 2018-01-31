var fs = require('fs');
var path = require('path');
var configfileReader = require('./configfile-reader.js');

module.exports = {
  from: from
};

function from(rootPath, configFilename) {
  return readProjectInfoAndKeepSearching(rootPath, configFilename, true);
}

function readProjectInfoAndKeepSearching(dirPath, configFilename, isFirstCall) {
  var configfilePath = path.format({
    dir: dirPath,
    base: configFilename
  });

  if(fs.existsSync(configfilePath)) {

    var projectInfo =  configfileReader.readFrom(configfilePath);

    projectInfo.root = isFirstCall;
    projectInfo.branches = readChildrenFrom(dirPath, configFilename);

    return projectInfo;
  } else {
    return false;
  }
}

function readChildrenFrom(dirPath, configFilename) {
  var childrenPaths = fs.readdirSync(dirPath);
  var children = [];

  for(var i=0; i < childrenPaths.length; i++) {
    var childPath = path.join(dirPath, childrenPaths[i]);
    var child = readProjectInfoAndKeepSearching(childPath, configFilename, false);

    children.push(child);
  }

  return children;
}
