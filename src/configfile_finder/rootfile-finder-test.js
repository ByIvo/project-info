var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var path = require('path');
var fs = require('fs');
var rootfileFinder = require('./rootfile-finder.js');
var configfileReader = require('./configfile-reader.js');

describe('Rootfile finder', function () {
  var fakeFilePath = path.join('/', 'home', 'project', 'file.json');
  var fakeProjectPath = path.join('/', 'home', 'project');
  var fakeWithourConfigfilePath = path.join('/', 'home', 'project', 'subproject', 'folder');
  var fakeSubprojectPath = path.join('/', 'home', 'project', 'subproject');
  var fakeConfigFilename = ".project-info.json";
  var fakeConfigRootFilepath = path.join(fakeProjectPath, fakeConfigFilename);
  var fakeNotExistingPath = path.join('/', 'home', 'notProject', 'path');

  beforeEach(function () {
    var fsStub = sinon.stub(fs, 'lstatSync');
    var configfileReaderStub = sinon.stub(configfileReader, 'readFrom');

    var statFileStub = {
      isFile: function () {
        return true;
      }
    };

    var statDirStub = {
      isFile: function () {
        return false;
      }
    };

    fsStub.withArgs(fakeFilePath).returns(statFileStub);
    fsStub.withArgs(fakeProjectPath).returns(statDirStub);
    fsStub.withArgs(fakeWithourConfigfilePath).returns(statDirStub);
    fsStub.withArgs(fakeNotExistingPath).returns(statDirStub);

    configfileReaderStub.withArgs(path.join(fakeWithourConfigfilePath, fakeConfigFilename)).returns(false);
    configfileReaderStub.withArgs(path.join(fakeSubprojectPath, fakeConfigFilename)).returns({
      root: false
    });
    configfileReaderStub.withArgs(fakeConfigRootFilepath).returns({
      root: true
    });
  });

  afterEach(function () {
    fs.lstatSync.restore();
    configfileReader.readFrom.restore();
  });

  it('If the path provided results in a file, the search should starts in the file\'s directory.', function () {
    var rootPath = rootfileFinder.upwards(fakeFilePath, fakeConfigFilename);

    expect(rootPath).to.equal(fakeProjectPath);
  });

  it('If the root config file is in the provided path, returns it!', function () {
    var rootPath = rootfileFinder.upwards(fakeProjectPath, fakeConfigFilename);

    expect(rootPath).to.equal(fakeProjectPath);
    expect(configfileReader.readFrom.getCall(0).args[0]).to.equal(fakeConfigRootFilepath);
  });

  it('If the path provided do not have a configfile in it, keep looking in upwards path until find it', function () {
    var rootPath = rootfileFinder.upwards(fakeWithourConfigfilePath, fakeConfigFilename);

    expect(configfileReader.readFrom.withArgs(path.join(fakeWithourConfigfilePath, fakeConfigFilename)).calledOnce).to.equal(true, "Call read file from WithoutConfigfile directory");
    expect(configfileReader.readFrom.withArgs(path.join(fakeSubprojectPath, fakeConfigFilename)).calledOnce).to.equal(true, "Call read file from subproject directory");
    expect(configfileReader.readFrom.withArgs(path.join(fakeProjectPath, fakeConfigFilename)).calledOnce).to.equal(true, "Call read file from project directory");

    expect(rootPath).to.equal(fakeProjectPath);
  });

  it('If it finds a non root configfile in the path provided, keep looking upwards.', function () {
    var rootPath = rootfileFinder.upwards(fakeWithourConfigfilePath, fakeConfigFilename);

    expect(rootPath).to.equal(fakeProjectPath);
  });

  it('If it can\'t find a root config file in any of upwards paths, it\'ll throw an exception', function () {
    expect(function () {
      var rootPath = rootfileFinder.upwards(fakeNotExistingPath, fakeConfigFilename);
    }).to.throw('It was not able to find a file named ' + fakeConfigFilename + ' in any upwards directory.');
  });
});
