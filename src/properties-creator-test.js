var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var path = require('path');
var fs = require('fs');
var propertiesCreator = require('./properties-creator.js');

var configfileFinder = require('./configfile_finder/configfile-finder.js');
var rootfileFinder = require('./configfile_finder/rootfile-finder.js');

describe('Properties creator', function () {
  var fakeRealPath = path.join('home', 'root', 'execution');
  var fakeRootPath = path.join('home', 'root');
  var configFilename = '.project-info.json';

  beforeEach(function () {
    var rootfileFinderStub = sinon.stub(rootfileFinder, 'upwards');
    var configfileFinderStub = sinon.stub(configfileFinder, 'from');

    rootfileFinderStub.withArgs(fakeRealPath, configFilename).returns(fakeRootPath);
    configfileFinderStub.withArgs(fakeRootPath, configFilename).returns({right: 'props'});
  });

  afterEach(function () {
    rootfileFinder.upwards.restore();
    configfileFinder.from.restore();
  });

  it('Should manage the modules to create the object with all properties.', function () {
     var objectProperties = propertiesCreator.create(fakeRealPath, configFilename);

     expect(objectProperties).to.deep.equal({right: 'props'});
  });
});
