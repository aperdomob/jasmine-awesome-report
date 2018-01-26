const chai = require('chai');
const uuid = require('uuid');
const { generateJson } = require('../src/wrapper');
const { sandbox } = require('sinon');

const assert = chai.assert;


// generateJson

describe('Given a json report', () => {
  let sandboxInstance;

  before(() => {
    sandboxInstance = sandbox.create();
    const uuidStub = sandboxInstance.stub(uuid, 'v4');
    uuidStub.onCall(0).returns('c357897e-3a0e-4351-9fa7-0a766ff7e619');
  });

  after(() => {
    sandboxInstance.restore();
  });

  describe('when convert the report to mocha-aweson', () => {
    const start = new Date('2017-08-29T21:48:13.023Z');
    const end = new Date('2017-08-29T21:49:13.023Z');
    let jasmineReport;
    let mochaAwesomeReport;

    before(() => {
      jasmineReport = {
        start,
        end,
        suites: [],
        tests: []
      };

      mochaAwesomeReport = generateJson(jasmineReport);
      // console.log(mochaAwesomeReport);
    });

    describe('and verify the stats', () => {
      it('then do not have suites', () => {
        assert.equal(0, mochaAwesomeReport.stats.suites);
      });

      it('then do not have tests', () => {
        assert.equal(undefined, mochaAwesomeReport.stats.tests);
      });

      it('then no test passed', () => {
        assert.equal(0, mochaAwesomeReport.stats.passes);
      });

      it('then no test pending', () => {
        assert.equal(0, mochaAwesomeReport.stats.pending);
      });

      it('then no test failures', () => {
        assert.equal(0, mochaAwesomeReport.stats.failures);
      });

      it('then should be have a start date', () => {
        assert.equal(start, mochaAwesomeReport.stats.start);
      });

      it('then should be have a end date', () => {
        assert.equal(end, mochaAwesomeReport.stats.end);
      });

      it('then should be have duration property', () => {
        assert.equal(60000, mochaAwesomeReport.stats.duration);
      });

      it('then should not be have testRegistered', () => {
        assert.equal(undefined, mochaAwesomeReport.stats.testsRegistered);
      });

      it('then should not calculate the pass percent', () => {
        assert.isNaN(mochaAwesomeReport.stats.passPercent);
      });

      it('then should not calculate the pending percent', () => {
        assert.isNaN(mochaAwesomeReport.stats.pendingPercent);
      });

      it('then should not have other', () => {
        assert.equal(0, mochaAwesomeReport.stats.other);
      });

      it('then should not have other', () => {
        assert.equal(false, mochaAwesomeReport.stats.hasOther);
      });

      it('then should not have skipped', () => {
        assert.equal(false, mochaAwesomeReport.stats.skipped);
      });

      it('then should not have hasSkipped', () => {
        assert.equal(false, mochaAwesomeReport.stats.hasSkipped);
      });

      it('then should be have passPercentClass', () => {
        assert.equal('warning', mochaAwesomeReport.stats.passPercentClass);
      });

      it('then should be have skipped', () => {
        assert.equal('danger', mochaAwesomeReport.stats.pendingPercentClass);
      });
    });

    describe('and verify root suite property', () => {
      it('then should not have title', () => {
        assert.equal('', mochaAwesomeReport.suites.title);
      });

      it('then should not have suites', () => {
        assert.equal(0, mochaAwesomeReport.suites.suites.length);
      });

      it('then should not have tests', () => {
        assert.equal(0, mochaAwesomeReport.suites.tests.length);
      });

      it('then should not have pending', () => {
        assert.equal(0, mochaAwesomeReport.suites.pending.length);
      });

      it('then should be root', () => {
        assert.equal(true, mochaAwesomeReport.suites.root);
      });

      it('then should be have timeout property', () => {
        assert.equal(0, mochaAwesomeReport.suites._timeout); // eslint-disable-line
      });

      it('then should be have uuid property', () => {
        assert.equal('c357897e-3a0e-4351-9fa7-0a766ff7e619', mochaAwesomeReport.suites.uuid);
      });

      it('then should not have beforeHooks', () => {
        assert.equal(0, mochaAwesomeReport.suites.beforeHooks.length);
      });

      it('then should not have afterHooks', () => {
        assert.equal(0, mochaAwesomeReport.suites.afterHooks.length);
      });

      it('then should not have fullFile', () => {
        assert.equal('', mochaAwesomeReport.suites.fullFile);
      });

      it('then should not have file', () => {
        assert.equal('', mochaAwesomeReport.suites.file);
      });

      it('then should not have passes', () => {
        assert.equal(0, mochaAwesomeReport.suites.passes.length);
      });

      it('then should not have failures', () => {
        assert.equal(0, mochaAwesomeReport.suites.failures.length);
      });

      it('then should not have skipped', () => {
        assert.equal(0, mochaAwesomeReport.suites.skipped.length);
      });

      it('then should not have hasBeforeHooks', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasBeforeHooks);
      });

      it('then should not have hasAfterHooks', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasAfterHooks);
      });

      it('then should not have hasTests', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasTests);
      });

      it('then should not have hasTests', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasTests);
      });

      it('then should not have totalTests', () => {
        assert.equal(0, mochaAwesomeReport.suites.totalTests);
      });

      it('then should not have totalPasses', () => {
        assert.equal(0, mochaAwesomeReport.suites.totalPasses);
      });

      it('then should not have totalFailures', () => {
        assert.equal(0, mochaAwesomeReport.suites.totalFailures);
      });

      it('then should not have totalPending', () => {
        assert.equal(0, mochaAwesomeReport.suites.totalPending);
      });

      it('then should not have totalSkipped', () => {
        assert.equal(0, mochaAwesomeReport.suites.totalSkipped);
      });

      it('then should not have hasPasses', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasPasses);
      });

      it('then should not have hasFailures', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasFailures);
      });

      it('then should not have hasPending', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasPending);
      });

      it('then should not have hasSkipped', () => {
        assert.equal(false, mochaAwesomeReport.suites.hasSkipped);
      });

      it('then should have duration', () => {
        assert.equal(0, mochaAwesomeReport.suites.duration);
      });

      it('then should be root', () => {
        assert.equal(true, mochaAwesomeReport.suites.rootEmpty);
      });
    });
  });
});
