const fs = require('fs');
const path = require('path');
const marge = require('mochawesome-report-generator');
const { generateJson } = require('./wrapper');

const removeParent = (tree) => {
  // eslint-disable-next-line no-param-reassign
  delete tree.parent;

  if (tree.suites) {
    tree.suites.forEach((node) => {
      removeParent(node);
    });
  }
};

const saveFile = (fullPath, fileName, json) => {
  fs.writeFileSync(path.join(fullPath, fileName), JSON.stringify(json, null, 2));
};

class AwesomeReport {
  static getReport(config) {
    let currentSuite;
    let json;

    return {
      jasmineStarted: (result) => {
        json = Object.assign(
          {},
          result,
          { parent: undefined, start: new Date(), suites: [], tests: [] });
        currentSuite = json;
      },
      suiteStarted: (result) => {
        const node = Object.assign(
          {},
          result,
          { parent: currentSuite, start: new Date(), suites: [], tests: [] });

        currentSuite.suites.push(node);
        currentSuite = node;
      },
      specStarted: (result) => {
        // eslint-disable-next-line no-param-reassign
        result.start = new Date();
      },
      specDone: (result) => {
        const node = Object.assign({}, result, { end: new Date() });

        currentSuite.tests.push(node);
      },
      suiteDone: (result) => {
        currentSuite.failedExpectations = result.failedExpectations;
        currentSuite.status = result.status;
        currentSuite.end = new Date();
        currentSuite = currentSuite.parent;
      },
      jasmineDone: (result) => {
        currentSuite.end = new Date();
        currentSuite.failedExpectations = result.failedExpectations;

        const report = generateJson(currentSuite);

        const reportDir = config && config.fullPath ? config.fullPath : 'jasmine-awesome-report';
        const reportFilename = config && config.fileName ? config.fileName : 'report';

        marge.createSync(report, {
          reportDir,
          reportTitle: 'Test Report',
          reportPageTitle: 'Test Report',
          inline: false,
          inlineAssets: false,
          charts: true,
          enableCharts: true,
          code: true,
          enableCode: true,
          autoOpen: false,
          overwrite: true,
          timestamp: false,
          ts: false,
          showHooks: 'failed',
          dev: false,
          reportFilename,
          saveJson: true,
          inlineDiffs: undefined,
          quiet: undefined,
          useInlineDiffs: undefined
        });

        saveFile(reportDir, `${reportFilename}.json`, report);
      }
    };
  }
}

exports.AwesomeReport = AwesomeReport;
