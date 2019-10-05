import { TestSection, TestCase, TestStep, TestAssertion } from "../project/project";
import { RunnerTime } from "../runner/state";

/**
 * Defines a test report interface
 */
export abstract class HurdleReporter {
  /**
   * Unique identifier of the reporter
   */
  static id: string;
  abstract projectStart(runnerTime: RunnerTime): void;
  abstract sectionStart(testSection: TestSection, runnerTime: RunnerTime): void;
  abstract caseStart(testCase: TestCase, runnerTime: RunnerTime): void;
  abstract testStart(testStep: TestStep, runnerTime: RunnerTime): void;
  abstract testPass(testStep: TestStep, check: TestAssertion): void;
  abstract testFail(testStep: TestStep, check: TestAssertion): void;
  abstract testSkip(testStep: TestStep, check: TestAssertion): void;
  abstract testEnd(testStep: TestStep, runnerTime: RunnerTime): void;
  abstract caseEnd(testCase: TestCase, runnerTime: RunnerTime): void;
  abstract sectionEnd(testSection: TestSection, runnerTime: RunnerTime): void;
  abstract projectEnd(runnerTime: RunnerTime): void;
}