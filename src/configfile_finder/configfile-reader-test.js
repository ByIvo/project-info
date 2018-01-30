var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var path = require('path');
var fs = require('fs');
var configfileReader = require('./configfile-reader.js');

describe('Configfile reader', function () {

  var noConfigFilePath = path.join('fake', 'path', 'file.txt');
  var directoryPath = path.join('fake', 'path');
  var configFilePath = path.join('fake', 'path', 'project-info.json');
  var notJsonFilePath = path.join('fake', 'path', 'not-json-file.props');

  beforeEach(function () {
    var fsExistsSyncStub = sinon.stub(fs, 'existsSync');
    var fsStat = sinon.stub(fs, 'lstatSync');
    var fsReadFile = sinon.stub(fs, 'readFileSync');

    fsExistsSyncStub.withArgs(noConfigFilePath).returns(false);
    fsExistsSyncStub.withArgs(directoryPath).returns(true);
    fsExistsSyncStub.withArgs(configFilePath).returns(true);
    fsExistsSyncStub.withArgs(notJsonFilePath).returns(true);

    fsStat.withArgs(directoryPath).returns(fakeFileStatWithReturnAs(false));
    fsStat.withArgs(configFilePath).returns(fakeFileStatWithReturnAs(true));
    fsStat.withArgs(notJsonFilePath).returns(fakeFileStatWithReturnAs(true));

    fsReadFile.withArgs(configFilePath).returns(
      '{"name": "Project"}'
    );

    fsReadFile.withArgs(notJsonFilePath).returns(
      "name=Project"
    );

  });

  afterEach(function () {
    fs.existsSync.restore();
    fs.lstatSync.restore();
    fs.readFileSync.restore();
  });

  it('If the path does not exists, returns false', function () {
    var configfile = configfileReader.readFrom(noConfigFilePath);

    expect(configfile).to.equal(false);
  });

  it('If the path is not a file, return false', function () {
    var configfile = configfileReader.readFrom(directoryPath);

    expect(fs.lstatSync.calledOnce).to.equal(true);
    expect(configfile).to.equal(false);
  });

  it('If the path contains a file, parse to json and returns it', function () {
      var configfile = configfileReader.readFrom(configFilePath);

      expect(fs.readFileSync.calledOnce).to.equal(true);
      expect(configfile).to.deep.equal({
        name: 'Project'
      });
  });

  it('If the file content is not in a json format, throw an Exception', function () {
    expect(function () {
      var configfile = configfileReader.readFrom(notJsonFilePath);
    }).to.throw("The config file in path '" + notJsonFilePath + "'' needs to be a json file.");
  });
});

function fakeFileStatWithReturnAs(file) {
  return {
    isFile: function () {
      return file;
    }
  };
}
