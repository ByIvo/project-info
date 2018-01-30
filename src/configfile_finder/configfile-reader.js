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
      var fileContent = fs.readFileSync(path);

      try{
        return JSON.parse(fileContent);
      }catch(err) {
        var message = "The config file in path '" + path + "'' needs to be a json file.";
        throw Error(message);
      }
    }
  }

  return false;
}
