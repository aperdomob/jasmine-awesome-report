[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

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
  fileName: 'report'
};

jasmine.getEnv().addReporter(AwesomeReport.getReport(config));
```

By default `fullPath` is `jasmine-awesome-report` and `fileName` is `report`
