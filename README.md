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
