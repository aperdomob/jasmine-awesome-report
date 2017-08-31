const chai = require('chai');
const { AwesomeReport } = require('../src/awesome');
const { sandbox } = require('sinon');

const assert = chai.assert;

describe('Given a jasmine execution', () => {
  let sandboxInstance;

  beforeEach(() => {
    sandboxInstance = sandbox.create();
  });

  afterEach(() => {
    sandboxInstance.restore();
  });

  describe('when get a report', () => {
    let report;

    beforeEach(() => {
      report = AwesomeReport.getReport();
    });

    describe('and start the execution', () => {
      const jasmineStartDate = new Date('2017-08-29T21:48:13.023Z');
      const startedParam = { name: 'Start jasmine' };
      let objectStub;
      const root = {
        suites: []
      };

      beforeEach(() => {
        objectStub = sandboxInstance.stub(Object, 'assign');
        objectStub.onCall(0).returns(root);

        sandboxInstance.useFakeTimers(jasmineStartDate);
        report.jasmineStarted(startedParam);
      });

      it('then Object.assign should be called', () => {
        assert.deepEqual({}, objectStub.getCall(0).args[0]);
        assert.deepEqual(startedParam, objectStub.getCall(0).args[1]);
        assert.deepEqual({
          parent: undefined,
          start: jasmineStartDate,
          suites: [],
          tests: []
        }, objectStub.getCall(0).args[2]);
      });

      describe('and start a suite', () => {
        const startSuite = { name: 'start suite' };
        const suite = {
          tests: []
        };

        beforeEach(() => {
          objectStub.onCall(1).returns(suite);
          report.suiteStarted(startSuite);
        });

        it('then Object.assign should be called', () => {
          assert.deepEqual({}, objectStub.getCall(1).args[0]);
          assert.deepEqual(startSuite, objectStub.getCall(1).args[1]);
          assert.deepEqual({
            parent: root,
            start: jasmineStartDate,
            suites: [],
            tests: []
          }, objectStub.getCall(1).args[2]);
        });

        describe('and finish a test', () => {
          const testResult = { name: 'test result' };

          beforeEach(() => {
            report.specDone(testResult);
          });

          it('then object.assign should be called', () => {
            assert.deepEqual({}, objectStub.getCall(2).args[0]);
            assert.deepEqual(testResult, objectStub.getCall(2).args[1]);
            assert.deepEqual({
              end: jasmineStartDate
            }, objectStub.getCall(2).args[2]);
          });
        });
      });
    });

    describe('when start a test', () => {
      const testStartDate = new Date('2017-08-29T21:48:13.023Z');
      const test = {};

      before(() => {
        sandboxInstance.useFakeTimers(testStartDate);
        report.specStarted(test);
      });

      it('then should be start property', () => {
        assert.deepEqual(testStartDate, test.start);
      });
    });
  });
});
