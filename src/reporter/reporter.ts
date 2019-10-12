import { TestSection, TestCase, TestStep, TestAssertion } from "../project/project";
import { RunnerTime } from "../runner/state";

/**
 * Defines a test report interface
 */
export interface HurdleReporter {
  /**
   * Unique identifier of the reporter
   */
  id: string;
  projectStart(runnerTime: RunnerTime): Promise<void>;
  sectionStart(testSection: TestSection, runnerTime: RunnerTime): Promise<void>;
  caseStart(testCase: TestCase, runnerTime: RunnerTime): Promise<void>;
  testStart(testStep: TestStep, runnerTime: RunnerTime): Promise<void>;
  testPass(testStep: TestStep, check: TestAssertion): Promise<void>;
  testFail(testStep: TestStep, check: TestAssertion): Promise<void>;
  testSkip(testStep: TestStep, check: TestAssertion): Promise<void>;
  testEnd(testStep: TestStep, runnerTime: RunnerTime): Promise<void>;
  caseEnd(testCase: TestCase, runnerTime: RunnerTime): Promise<void>;
  sectionEnd(testSection: TestSection, runnerTime: RunnerTime): Promise<void>;
  projectEnd(runnerTime: RunnerTime): Promise<void>;
}
