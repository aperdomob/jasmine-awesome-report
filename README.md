[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Coverage Status](https://coveralls.io/repos/github/aperdomob/jasmine-awesome-report/badge.svg?branch=development)](https://coveralls.io/github/aperdomob/jasmine-awesome-report?branch=development)

[![NPM](https://nodei.co/npm/jasmine-awesome-report.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/semantic-release/)

# Jasmine Aweson Report
This project is inspired in [mochawesome](https://github.com/adamgruber/mochawesome).

## How to Use
Install this project how dev-dependency
`npm i --save-dev jasmine-awesome-report`

Into jasmine config file include the follow lines:

```js
const { AwesomeReport } = require('jasmine-awesome-report');

const config = {
  fullPath: 'awesome-report',
  fileName: 'report',
  merge: true
};

jasmine.getEnv().addReporter(AwesomeReport.getReport(config));
```

| Property | Default value | Description |
| -------- | :-----------: | ----------- |
| fullPath | awesome-report | folder when the report will be saved |
| fileName | report | report file name |
| merge | false | merge the result with other json with the same name |

