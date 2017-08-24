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

