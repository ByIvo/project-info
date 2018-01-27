var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var path = require('path');

var fs = require('fs');
var projectInfo = require('./index.js');
var propertiesCreator = require('./properties-creator.js');

describe("index.js", function () {
  var fakeRealPath = path.join('fake', 'real', 'path');
  var fakeUnexistingPath = path.join('fake', 'unexisting', 'path');

  beforeEach(function () {
    var fsStub = sinon.stub(fs, 'existsSync');
    var propertiesCreatorStub = sinon.stub(propertiesCreator, 'create');

    fsStub.withArgs(fakeRealPath).returns(true);
    fsStub.withArgs(fakeUnexistingPath).returns(false);

    propertiesCreatorStub.onFirstCall().returns({name: 'fake'});
  });

  afterEach(function () {
    fs.existsSync.restore();
    propertiesCreator.create.restore();
  });

  it('Should verify if the path does exists', function () {
    projectInfo.from(fakeRealPath);

    expect(fs.existsSync.getCall(0).args[0]).to.equal(fakeRealPath);
  });

  it('Should throw an error if the path does not exists', function () {
    expect(function () {
      projectInfo.from(fakeUnexistingPath);

    }).to.throw('Path "'+ fakeUnexistingPath +'" does not exists!');
  });

  it('Should make a call to properties creator and returns it\'s return! ', function () {
    var projectProperties = projectInfo.from(fakeRealPath, 'my-custom-config-file.json');

    expect(projectProperties).to.deep.equal({name: 'fake'});
    expect(propertiesCreator.create.getCall(0).args[1]).to.equal('my-custom-config-file.json');
  });

  it('Should make a call with default configFilename because no one was provided', function () {
    var projectProperties = projectInfo.from(fakeRealPath);

    expect(projectProperties).to.deep.equal({name: 'fake'});
    expect(propertiesCreator.create.getCall(0).args[1]).to.equal('project.info.json');
  });
});
