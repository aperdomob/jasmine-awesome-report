const uuid = require('uuid');

const getSuiteAccount = jsonBase =>
  jsonBase.suites.length + jsonBase.suites.reduce((sum, value) => sum + getSuiteAccount(value), 0);

const counter = (status, jsonBase) => {
  let total = jsonBase.tests.filter(test => test.status === status).length;

  jsonBase.suites.forEach((suite) => {
    total += counter(status, suite);
  });

  return total;
};

const getTestPassesAccount = jsonBase => counter('passed', jsonBase);
const getTestPendingAccount = jsonBase => counter('pending', jsonBase);
const getTestFailuresAccount = jsonBase => counter('failed', jsonBase);

const diff = (startDate, endDate) => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  return Math.abs(timeDiff);
};

const createStats = (jsonBase) => {
  const suites = getSuiteAccount(jsonBase);
  const passes = getTestPassesAccount(jsonBase);
  const pending = getTestPendingAccount(jsonBase);
  const failures = getTestFailuresAccount(jsonBase);

  return {
    suites,
    tests: jsonBase.totalSpecsDefined,
    passes,
    pending,
    failures,
    start: jsonBase.start,
    end: jsonBase.end,
    duration: diff(jsonBase.start, jsonBase.end),
    testsRegistered: jsonBase.totalSpecsDefined,
    passPercent: Number(((passes / (passes + failures)) * 100).toFixed(2)),
    pendingPercent: Number(((pending / jsonBase.totalSpecsDefined) * 100).toFixed(2)),
    other: 0,
    hasOther: false,
    skipped: 0,
    hasSkipped: false,
    passPercentClass: 'warning',
    pendingPercentClass: 'danger'
  };
};

const generateSuiteTemplate = () => ({
  title: '',
  suites: [],
  tests: [],
  pending: [],
  root: false,
  _timeout: 0,
  uuid: uuid.v4(),
  beforeHooks: [],
  afterHooks: [],
  fullFile: '',
  file: '',
  passes: [],
  failures: [],
  skipped: [],
  hasBeforeHooks: false,
  hasAfterHooks: false,
  hasTests: false,
  hasSuites: false,
  totalTests: 0,
  totalPasses: 0,
  totalFailures: 0,
  totalPending: 0,
  totalSkipped: 0,
  hasPasses: false,
  hasFailures: false,
  hasPending: false,
  hasSkipped: false,
  duration: 0,
  rootEmpty: false
});

const generateTestTemplate = (parentUuid, test) => ({
  title: test.description,
  fullTitle: test.fullName,
  timedOut: false,
  duration: 0,
  pass: false,
  fail: false,
  pending: false,
  code: '',
  err: {},
  isRoot: false,
  uuid: uuid.v4(),
  parentUUID: parentUuid,
  isHook: false,
  skipped: false
});

const populateTest = (parentUuid, test) => {
  const node = generateTestTemplate(parentUuid, test);
  if (test.status === 'passed') {
    node.title = test.description;
    node.fullTitle = test.fullName;
    node.duration = diff(test.start, test.end);
    node.state = 'passed';
    node.speed = 'fast';
    node.pass = true;
    node.parentUUID = parentUuid;
  } else if (test.status === 'failed') {
    node.title = test.description;
    node.fullTitle = test.fullName;
    node.duration = diff(test.start, test.end);
    node.state = 'failed';
    node.fail = true;
    node.parentUUID = parentUuid;
    node.err = {
      message: test.failedExpectations[0].message,
      estack: test.failedExpectations[0].stack,
      diff: `- ${test.failedExpectations[0].expected}\n+ ${test.failedExpectations[0].actual}\n`
    };
  } else if (test.status === 'pending') {
    node.title = test.description;
    node.fullTitle = test.fullName;
    node.pending = true;
    node.parentUUID = parentUuid;
  }

  return node;
};

const populateSuite = (suite) => {
  const template = generateSuiteTemplate();
  template.title = suite.description;
  template.duration = diff(suite.start, suite.end);
  template.totalTests = suite.tests.length;
  template.hasTests = template.totalTests !== 0;
  template.hasSuites = suite.suites.length !== 0;
  template.suites = suite.suites.map(internalSuite => populateSuite(internalSuite));
  template.tests = suite.tests.map(test => populateTest(template.uuid, test));
  template.pending = template.tests.filter(test => test.pending);
  template.passes = template.tests.filter(test => test.pass);
  template.failures = template.tests.filter(test => test.fail);
  template.totalTests = template.tests.length;
  template.totalPasses = template.passes.length;
  template.totalFailures = template.failures.length;
  template.totalPending = template.pending.length;
  template.hasPasses = template.totalPasses > 0;
  template.hasFailures = template.totalFailures > 0;
  template.hasPending = template.totalPending > 0;

  return template;
};

const createSuites = (jsonBase) => {
  const base = generateSuiteTemplate();
  base.root = true;
  base.hasSuites = true;
  base.rootEmpty = true;
  base.suites = jsonBase.suites.map(suite => populateSuite(suite));

  return base;
};

const getAllTests = (suite) => {
  let testList = [];

  testList = testList.concat(suite.tests);

  suite.suites.forEach((element) => {
    testList = testList.concat(getAllTests(element));
  });

  return testList;
};

function generateJson(jsonBase) {
  const stats = createStats(jsonBase);
  const suites = createSuites(jsonBase);
  const allTests = getAllTests(suites);

  const result = {
    stats,
    suites,
    allTests,
    allPending: allTests.filter(test => test.pending),
    allPasses: allTests.filter(test => test.pass),
    allFailures: allTests.filter(test => test.fail)
  };

  return result;
}

function mergeJson(firstJson, secondJson) {
  const result = Object.assign({}, firstJson);

  const firstStart = new Date(firstJson.stats.start);
  const secondStart = new Date(secondJson.stats.start);

  const firstEnd = new Date(firstJson.stats.end);
  const secondEnd = new Date(secondJson.stats.end);

  const passes = result.stats.passes + secondJson.stats.passes;
  const failures = result.stats.failures + secondJson.stats.failures;
  const pending = result.stats.pending + secondJson.stats.pending;
  const testsRegistered = result.stats.testsRegistered + secondJson.stats.testsRegistered;

  result.stats.suites += secondJson.stats.suites;
  result.stats.tests += secondJson.stats.tests;
  result.stats.passes = passes;
  result.stats.pending = pending;
  result.stats.failures = failures;
  result.stats.start = firstStart < secondStart ? firstStart : secondStart;
  result.stats.end = firstEnd > secondEnd ? firstEnd : secondEnd;
  result.stats.duration = diff(result.stats.start, result.stats.end);
  result.stats.testsRegistered = testsRegistered;
  result.stats.passPercent = Number(((passes / (passes + failures)) * 100).toFixed(2));
  result.stats.pendingPercent = Number(((pending / testsRegistered) * 100).toFixed(2));

  result.suites.suites = result.suites.suites.concat(secondJson.suites.suites);
  result.allTests = result.allTests.concat(secondJson.allTests);
  result.allPending = result.allPending.concat(secondJson.allPending);
  result.allPasses = result.allPasses.concat(secondJson.allPasses);
  result.allFailures = result.allFailures.concat(secondJson.allFailures);

  return result;
}

exports.generateJson = generateJson;
exports.mergeJson = mergeJson;

