var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var path = require('path');
var fs = require('fs');
var configfileFinder = require('./configfile-finder.js');
var configfileReader = require('./configfile-reader.js');

describe('Configfile finder', function () {
  var fakeNoConfigfilePath = path.join('fake', 'path');
  var fakeRealConfigfilePath = path.join('fake', 'real', 'path');
  var configFilename = 'project-info.json';

  var fakeFirstChildPath = path.join(fakeRealConfigfilePath, 'child-one');
  var fakeSecondChildPath = path.join(fakeRealConfigfilePath, 'child-two');
  var fakeGranchildPath = path.join(fakeFirstChildPath, 'grand-child');

  beforeEach(function () {
    var existsStub = sinon.stub(fs, 'existsSync');
    var readFromStub = sinon.stub(configfileReader, 'readFrom');
    var readDirStub = sinon.stub(fs, 'readdirSync');

    existsStub.withArgs(path.join(fakeNoConfigfilePath, configFilename)).returns(false);
    existsStub.withArgs(path.join(fakeRealConfigfilePath, configFilename)).returns(true);
    existsStub.withArgs(path.join(fakeFirstChildPath, configFilename)).returns(true);
    existsStub.withArgs(path.join(fakeSecondChildPath, configFilename)).returns(true);
    existsStub.withArgs(path.join(fakeGranchildPath, configFilename)).returns(true);

    readDirStub.withArgs(fakeRealConfigfilePath).returns(['child-one', 'child-two']);
    readDirStub.withArgs(fakeFirstChildPath).returns(['grand-child']);
    readDirStub.withArgs(fakeSecondChildPath).returns([]);
    readDirStub.withArgs(fakeGranchildPath).returns([]);

    readFromStub.withArgs(path.join(fakeRealConfigfilePath, configFilename)).returns({
      name: 'Project',
      root: true,
      custom: 'property'
    });

    readFromStub.withArgs(path.join(fakeFirstChildPath, configFilename)).returns({
      name: 'Project-child-one',
      root: false
    });

    readFromStub.withArgs(path.join(fakeSecondChildPath, configFilename)).returns({
      name: 'Project-child-two',
      root: true,
      path: 'a'
    });

    readFromStub.withArgs(path.join(fakeGranchildPath, configFilename)).returns({
      name: 'Project-child-one-grandchild',
      path: 'a'
    });
  });

  afterEach(function () {
    fs.existsSync.restore();
    configfileReader.readFrom.restore();
    fs.readdirSync.restore();
  });

  it('If the file does not exists, just ignore it and return false', function () {
    var projectInfo = configfileFinder.from(fakeNoConfigfilePath, configFilename);

    expect(projectInfo).to.equal(false);
  });

  it('Should read the file as property object and returns it', function () {
    var projectInfo = configfileFinder.from(fakeGranchildPath, configFilename);

    expect(projectInfo).to.deep.equal({
      name: 'Project-child-one-grandchild',
      path: 'a',
      branches: [],
      root: true
    });
  });

  it('Should list all children directories and read their configfile if it exists. This process should be done recursivelly', function () {
      var projectInfo = configfileFinder.from(fakeRealConfigfilePath, configFilename);

      var everyoneWasCalled = fs.readdirSync.withArgs(fakeRealConfigfilePath).calledOnce &&
      fs.readdirSync.withArgs(fakeFirstChildPath).calledOnce  &&
      fs.readdirSync.withArgs(fakeSecondChildPath).calledOnce &&
      fs.readdirSync.withArgs(fakeGranchildPath).calledOnce;

      expect(everyoneWasCalled).to.equal(true);

      expect(projectInfo).to.deep.equal({
        name: 'Project',
        root: true,
        custom: 'property',
        branches: [
          {
            name: 'Project-child-one',
            root: false,
            branches: [
              {
                name: 'Project-child-one-grandchild',
                path: 'a',
                branches: [],
                root: false
              }
            ]
          }, {
            name: 'Project-child-two',
            root: false,
            path: 'a',
            branches: []
          }
        ]
      });
  });

  it('Should override root property with false value when the project file was not the root one', function () {
    var projectInfo = configfileFinder.from(fakeFirstChildPath, configFilename);

    expect(projectInfo).to.deep.equal({
        name: 'Project-child-one',
        root: true,
        branches: [
          {
            name: 'Project-child-one-grandchild',
            path: 'a',
            branches: [],
            root: false
          }
        ]
    });
  });
});
