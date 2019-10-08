import { HurdleReporter } from '../reporter/reporter';
import { RunnerState, RunnerTime } from './state';
import { TestSection, TestCase, TestStep, TestAssertion } from '../project/project';

export class ReporterRunner {
  queue: QueueReportAction[] = [];
  reporters: HurdleReporter[];
  constructor(reporters: HurdleReporter[]) {
    this.reporters = reporters;
    setInterval(this.execute, 1000);
  }

  execute() {
    while (queue.length > 0) {
      let obj = this.queue.shift();
      const { runnerTime, testSection, testCase, testStep, testCheck } = { ...obj.properties };

      switch (obj.action) {
        case ReportAction.projecStart:
          this.reporters.forEach(reporter => reporter.projectStart(runnerTime));
          break;
        case ReportAction.projectEnd:
          this.reporters.forEach(reporter => reporter.projectEnd(runnerTime));
          break;
        case ReportAction.sectionStart:
          this.reporters.forEach(reporter => reporter.sectionStart(testSection, runnerTime));
          break;
        case ReportAction.sectionEnd:
          this.reporters.forEach(reporter => reporter.sectionEnd(testSection, runnerTime));
          break;
        case ReportAction.caseStart:
          this.reporters.forEach(reporter => reporter.caseStart(testCase, runnerTime));
          break;
        case ReportAction.caseEnd:
          this.reporters.forEach(reporter => reporter.caseEnd(testCase, runnerTime));
          break;
        case ReportAction.testStart:
          this.reporters.forEach(reporter => reporter.testStart(testStep, runnerTime));
          break;
        case ReportAction.testEnd:
          this.reporters.forEach(reporter => reporter.testEnd(testStep, runnerTime));
          break;
        case ReportAction.testPass:
          this.reporters.forEach(reporter => reporter.testPass(testStep, testCheck));
          break;
        case ReportAction.testFail:
          this.reporters.forEach(reporter => reporter.testFail(testStep, testCheck));
          break;
        default:
          //improper queued object should never happen
          throw Error('Impossible');
          break;
      }
    }
  }

  queueProjectStart(runnerTime: RunnerTime) {
    queue.push({ action: ReportAction.projectStart, properties: { runnerTime } });
  }
}

interface QueueReportAction {
  action: ReportAction;
  properties: any;
}

enum ReportAction {
  projectStart,
  projectEnd,
  sectionStart,
  sectionEnd,
  caseStart,
  caseEnd,
  testStart,
  testEnd,
  testPass,
  testFail
}
