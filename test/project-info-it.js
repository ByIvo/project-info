var chai = require('chai');
var expect = chai.expect;
var path = require('path');
var fs = require('fs-extra');
var os = require('os');

var projectInfoScanner = require('./../src/index.js');

var configFilename = '.project-info.json';
var testFolder = 'project-info-it';
describe('Integration test of this node package', function () {

  beforeEach(function () {
    /* creating this project struction and config file named .project-info.json
    * | -------------------------
    * | + project {root: true}
    * |   +  sub-module-1 {root: true}
    * |     + module-1-1 {root: false}
    * |     + module-1-2 {}
    * |     + any-folder
    * |   +  sub-module-2 {}
    * |     + module-2-1 {}
    * |   +  sub-module-3{root: true}
    * |     + any-folder
    * | -----------------------
    */

    createFolder('project', {root: true, custom: 'anyValue'});
    createFolder('project/sub-module-1', {root: true});
    createFolder('project/sub-module-1/module-1-1', {root: false});
    createFolder('project/sub-module-1/module-1-2', {property: true});
    createFolder('project/sub-module-1/any-folder');
    createFolder('project/sub-module-2', {});
    createFolder('project/sub-module-2/module-2-1', {});
    createFolder('project/sub-module-3', {root: true});
    createFolder('project/sub-module-3/any-folder');
    createFolder('project/sub-module-3/any-folder/any-folder');
    createFolder('project/sub-module-3/custom-config', {root: true, property: false}, '.custom-file-name.json');
  });

  afterEach(removeTempFiles);
  before(removeTempFiles);
  after(removeTempFiles);

  it('Should read the first upwards root config file and deeplly fill it just as expected',function () {
    var executionPath = path.join(os.tmpdir(), testFolder, 'project/sub-module-3');
    var projectInfo = projectInfoScanner.from(executionPath);

    expect(projectInfo).to.deep.equal({
      name: 'sub-module-3',
      dir: path.join(executionPath, configFilename),
      root: true,
      branches: []
    });
  });

  it('Should keep looking upwards until find a root file even if there is more than one empty folder', function () {
    var executionPath = path.join(os.tmpdir(), testFolder, 'project/sub-module-3/any-folder/any-folder');
    var projectInfo = projectInfoScanner.from(executionPath);

    expect(projectInfo).to.deep.equal({
      name: 'sub-module-3',
      dir: path.join(os.tmpdir(), testFolder,  'project/sub-module-3/', configFilename),
      root: true,
      branches: []
    });
  });

  it('Should keep the custom fields properties', function () {
    var executionPath = path.join(os.tmpdir(), testFolder, 'project/sub-module-1/module-1-1');
    var projectInfo = projectInfoScanner.from(executionPath);

    expect(projectInfo).to.deep.equal({
      name: 'sub-module-1',
      dir: path.join(os.tmpdir(), testFolder, 'project/sub-module-1', configFilename),
      root: true,
      branches: [{
          name: 'module-1-1',
          dir: path.join(executionPath, configFilename),
          root: false,
          branches: []
        }, {
          name: 'module-1-2',
          dir: path.join(os.tmpdir(), testFolder, 'project/sub-module-1/module-1-2', configFilename),
          root: false,
          property: true,
          branches: []
      }]
    });
  });

  it('Should read all children starting from first root config file', function () {
    var executionPath = path.join(os.tmpdir(), testFolder, 'project');
    var projectInfo = projectInfoScanner.from(executionPath);

    expect(projectInfo).to.deep.equal({
      name: 'project',
      custom: 'anyValue',
      dir: path.join(executionPath, configFilename),
      root: true,
      branches: [{
        name: 'sub-module-1',
        dir: path.join(executionPath, 'sub-module-1', configFilename),
        root: false,
        branches: [{
            name: 'module-1-1',
            dir: path.join(executionPath, 'sub-module-1/module-1-1', configFilename),
            root: false,
            branches: []
          }, {
            name: 'module-1-2',
            dir: path.join(executionPath, 'sub-module-1/module-1-2', configFilename),
            root: false,
            property: true,
            branches: []
        }]
      }, {
        name: 'sub-module-2',
        dir: path.join(executionPath, 'sub-module-2', configFilename),
        root: false,
        branches: [{
          name: 'module-2-1',
          dir: path.join(executionPath, 'sub-module-2/module-2-1', configFilename),
          root: false,
          branches: []
        }]
      }, {
        name: 'sub-module-3',
        dir: path.join(executionPath, 'sub-module-3', configFilename),
        root: false,
        branches: []
      }]
    });
  });


  it('Should the custom config file and ignore everything else', function () {
    var executionPath = path.join(os.tmpdir(), testFolder, 'project/sub-module-3/custom-config');
    var projectInfo = projectInfoScanner.from(executionPath, '.custom-file-name.json');

    expect(projectInfo).to.deep.equal({
      name: 'custom-config',
      dir: path.join(executionPath, '.custom-file-name.json'),
      property: false,
      root: true,
      branches: []
    });
  });
});

function createFolder(relativePath, projectInfo, customFileName) {
  var fullPath = path.join(os.tmpdir(), testFolder, relativePath);
  var lastFolderName = path.parse(fullPath).base;

  fs.ensureDirSync(fullPath);

  if(projectInfo) {
    projectInfo.name = path.parse(fullPath).name;

    fs.writeJsonSync(path.join(fullPath, customFileName || configFilename), projectInfo);
    projectInfo.name = lastFolderName;
  }
}

function removeTempFiles() {
  fs.removeSync(path.join(os.tmpdir(), testFolder));
}
