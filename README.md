# Project-info

[![Travis](https://img.shields.io/travis/ByIvo/project-info.svg)](https://travis-ci.org/ByIvo/project-info)
[![Coveralls github](https://img.shields.io/coveralls/github/ByIvo/project-info.svg)](https://coveralls.io/github/ByIvo/project-info)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Known Vulnerabilities](https://snyk.io/test/github/byivo/project-info/badge.svg?targetFile=package.json)](https://snyk.io/test/github/byivo/project-info?targetFile=package.json)

[![NPM](https://nodei.co/npm/project-info-scanner.png?downloads=true&downloadRank=true)](https://nodei.co/npm/project-info-scanner/)

This project searches and reads hierarchically a configuration file in a path provided by params;
(e.g. This package can be used to scan and map a set os custom information to feedback and help a CLI code generation tool, making it clever enough to change across mapped directories and do what it takes to its successfuly execution).

##  Getting started

To make use of this package in your project, just npm install like this: 

```bash
$ npm i project-info-scanner
```

## How it works
The scan process works in two different phases:
* First, the package get the path provided as first parameter and tries to find a *.project-info.json* file with a __true__ valued __root__ property (this filename should be provided as second parameter, but the default value is .project-info.json); If the path does not have a configuration file, it'll look upwards until find it. (When the seach process reaches the root path in filesystem, an error is thrown).
* The second part is the scan process itself. It will start to read the root config file (that it found in First phase) and also reads all children folder seeking for another config files; If the child folder does not contain a config file, the tree search stops there and continue in siblings.

## Usage example
This package have only one method called __"from"__.
The method __from__ has only two parameters:
  * __path__: <string> required string to be used as initial path of First search phase.
  * __configFilename__: <string> optional string that reffers to the config filename that will be seeked; The default value is *.project-info.json*

### from(absolutePath [, configFileName])

```javascript
var projectInfoScanner = require('project-info-scanner');

projectInfoScanner.from('/any/path/you/want');
// If you named your configfile unlike the default value
projectInfoScanner.from('/any/path/you/want', 'your-custom-name.json');
```
See a detailed usage [HERE](https://gist.github.com/ByIvo/ec75b920750ef2aa53e907623bfd9fc6)

## The config file structure

The config file should always be written with JSON syntax. Its default name is *.project-info.json*, but can be provided another one as second parameter in __from__ method.

### Restricted properties

There are only two required properties:
  * __name__: A required string property that must contains the project name (An error is thrown if it's empty or not provided)
  * __root__: It's only required in the root config file and must contains the value *true*; If not provided, the package will consider as non root file, even if it was the last existing one in seach process.

Besides those required properties, we have another couple that are created when the config file is read:
* __dir__: A string containing the full path to config file itself.
* __branches__: An array containing others config files found in children folder (and it keeps going search whenever a child path contains a config file)

__Obs:__ If you manually set any of this properties (*dir* and *branches*), the package will overwrite them with the correct values.

### Custom properties
Respecting the JSON syntax, you can add any custom property you want and it will be included in the final output.

if you want a detailed example, see this [GIST](https://gist.github.com/ByIvo/ec75b920750ef2aa53e907623bfd9fc6)

## How to contribute

Just create a pull request that passes in build process (see [travis-ci](https://travis-ci.org/ByIvo/project-info)) and maximum descreases the [coverage percentage](https://coveralls.io/github/ByIvo/project-info) by 10%.
