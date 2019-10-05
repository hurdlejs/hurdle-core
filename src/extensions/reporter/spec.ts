import { RunnerTime } from '../../runner/state';
import { TestAssertion, TestStep, TestSection, TestCase } from '../../project/project';
import { HurdleReporter } from '../../reporter/reporter';

/**
 * Spec reporter 
 */
export class SpecReporter implements HurdleReporter {
  static id = 'spec';

  projectStart(runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  sectionStart(testSection: TestSection, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  caseStart(testCase: TestCase, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  testStart(testStep: TestStep, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  testPass(testStep: TestStep, check: TestAssertion): void {
    throw new Error("Method not implemented.");
  }
  testFail(testStep: TestStep, check: TestAssertion): void {
    throw new Error("Method not implemented.");
  }
  testSkip(testStep: TestStep, check: TestAssertion): void {
    throw new Error("Method not implemented.");
  }
  testEnd(testStep: TestStep, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  caseEnd(testCase: TestCase, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  sectionEnd(testSection: TestSection, runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
  projectEnd(runnerTime: RunnerTime): void {
    throw new Error("Method not implemented.");
  }
}
