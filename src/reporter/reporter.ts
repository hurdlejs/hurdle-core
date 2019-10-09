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
  abstract projectStart(runnerTime: RunnerTime): Promise<void>;
  abstract sectionStart(testSection: TestSection, runnerTime: RunnerTime): Promise<void>;
  abstract caseStart(testCase: TestCase, runnerTime: RunnerTime): Promise<void>;
  abstract testStart(testStep: TestStep, runnerTime: RunnerTime): Promise<void>;
  abstract testPass(testStep: TestStep, check: TestAssertion): Promise<void>;
  abstract testFail(testStep: TestStep, check: TestAssertion): Promise<void>;
  abstract testSkip(testStep: TestStep, check: TestAssertion): Promise<void>;
  abstract testEnd(testStep: TestStep, runnerTime: RunnerTime): Promise<void>;
  abstract caseEnd(testCase: TestCase, runnerTime: RunnerTime): Promise<void>;
  abstract sectionEnd(testSection: TestSection, runnerTime: RunnerTime): Promise<void>;
  abstract projectEnd(runnerTime: RunnerTime): Promise<void>;
}
