import { HurdleReporter } from '../reporter/reporter';
import { RunnerTime } from './state';
import { TestSection, TestCase, TestStep, TestAssertion } from '../project/project';

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
  testFail,
  endRunner
}

export class ReporterRunner {
  queue: QueueReportAction[] = [];
  reporters: HurdleReporter[] = [];
  processing = false;
  interval: NodeJS.Timer;

  constructor(reporters: HurdleReporter[]) {
    this.reporters = reporters;
    this.interval = setInterval(() => { this.execute() }, 1000);
  }

  execute() {
    if (!this.processing && this.queue.length > 0) {
      const obj = this.queue.shift();
      if (obj) {
        const { runnerTime = {}, testSection = {}, testCase = {}, testStep = {}, testCheck = {} } = { ...obj.properties };
        const promises: Promise<void>[] = [];
        this.processing = true;
        switch (obj.action) {
          case ReportAction.projectStart:
            this.reporters.forEach(reporter => promises.push(reporter.projectStart(runnerTime)));
            break;
          case ReportAction.projectEnd:
            this.reporters.forEach(reporter => promises.push(reporter.projectEnd(runnerTime)));
            break;
          case ReportAction.sectionStart:
            this.reporters.forEach(reporter => promises.push(reporter.sectionStart(testSection, runnerTime)));
            break;
          case ReportAction.sectionEnd:
            this.reporters.forEach(reporter => promises.push(reporter.sectionEnd(testSection, runnerTime)));
            break;
          case ReportAction.caseStart:
            this.reporters.forEach(reporter => promises.push(reporter.caseStart(testCase, runnerTime)));
            break;
          case ReportAction.caseEnd:
            this.reporters.forEach(reporter => promises.push(reporter.caseEnd(testCase, runnerTime)));
            break;
          case ReportAction.testStart:
            this.reporters.forEach(reporter => promises.push(reporter.testStart(testStep, runnerTime)));
            break;
          case ReportAction.testEnd:
            this.reporters.forEach(reporter => promises.push(reporter.testEnd(testStep, runnerTime)));
            break;
          case ReportAction.testPass:
            this.reporters.forEach(reporter => promises.push(reporter.testPass(testStep, testCheck)));
            break;
          case ReportAction.testFail:
            this.reporters.forEach(reporter => promises.push(reporter.testFail(testStep, testCheck)));
            break;
          case ReportAction.endRunner:
            clearInterval(this.interval);
            break;
          default:
            //improper queued object should never happen
            throw Error('Impossible');
            break;
        }

        Promise.all(promises).then((results) => this.processing = false);
      }
    }
  }

  queueProjectStart(runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.projectStart, properties: { runnerTime } });
  }

  queueProjectEnd(runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.projectEnd, properties: { runnerTime } });
  }

  queueSectionStart(testSection: TestSection, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.sectionStart, properties: { testSection, runnerTime } });
  }

  queueSectionEnd(testSection: TestSection, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.sectionEnd, properties: { testSection, runnerTime } });
  }

  queueCaseStart(testCase: TestCase, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.caseStart, properties: { testCase, runnerTime } });
  }

  queueCaseEnd(testCase: TestCase, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.caseEnd, properties: { testCase, runnerTime } });
  }

  queueTestStart(testStep: TestStep, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.testStart, properties: { testStep, runnerTime } });
  }

  queueTestEnd(testStep: TestStep, runnerTime: RunnerTime): void {
    this.queue.push({ action: ReportAction.testEnd, properties: { testStep, runnerTime } });
  }

  queueTestPass(testStep: TestStep, testCheck: TestAssertion): void {
    this.queue.push({ action: ReportAction.testPass, properties: { testStep, testCheck } });
  }

  queueTestFail(testStep: TestStep, testCheck: TestAssertion): void {
    this.queue.push({ action: ReportAction.testFail, properties: { testStep, testCheck } });
  }

  endRunner(): void {
    this.queue.push({ action: ReportAction.endRunner, properties: { } });
  }
}
