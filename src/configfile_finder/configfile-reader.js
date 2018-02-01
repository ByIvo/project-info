var fs = require('fs');

module.exports = {
  readFrom: readFrom
};

function readFrom(path) {
  var isRealPath = fs.existsSync(path);

  if(isRealPath) {
    var stat = fs.lstatSync(path);
    var isFile = stat.isFile();

    if(isFile) {
      var parsedContent = parseFileContent(path);

      if(parsedContent.name) {
        return parsedContent;
      } else {
        throw Error('The config file in path \'' + path + '\' does not have a property \'name\', which one is required.');
      }
    }
  }

  return false;
}

function parseFileContent(path) {
  try{
    var fileContent = fs.readFileSync(path);

    return JSON.parse(fileContent);
  }catch(err) {
    console.error(err);
    var message = 'The config file in path \'' + path + '\' needs to be a json file.';
    throw Error(message);
  }
}
