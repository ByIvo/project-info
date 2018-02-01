# Project-info

[![Travis](https://img.shields.io/travis/ByIvo/project-info.svg)](https://travis-ci.org/ByIvo/project-info)
[![Coveralls github](https://img.shields.io/coveralls/github/ByIvo/project-info.svg)](https://coveralls.io/github/ByIvo/project-info)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

[![NPM](https://nodei.co/npm/project-info-scanner.png?downloads=true&downloadRank=true)](https://nodei.co/npm/project-info-scanner/)

This project searches and reads hierarchically a configuration file in a path provided by params.

##  Getting started

To make use of this package in your project, just npm install like this: 

```bash
$ npm i project-info-scanner
```

## How it works
 

## Usage example

### from(absolutePath [, configFileName])
* absolutepath - required string
* configFilename - optional string, default=".project-info.json"

```bash
var projectInfoScanner = require('project-info-scanner');

projectInfoScanner.from('/any/path/you/want');
// If you named your configfile unlike the default value
projectInfoScanner.from('/any/path/you/want', 'your-custom-name.json');
```

## The .project-info.json file

There are only two required properties: *name* and *root*
* The *name* property is a string value and always should be informed
* The *root* property is a boolean and its default value is true (its used to flag the stop when the module searches upwards for a config file)
