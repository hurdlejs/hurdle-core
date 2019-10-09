import { RunnerTime } from '../../runner/state';
import { TestAssertion, TestStep, TestSection, TestCase } from '../../project/project';
import { HurdleReporter } from '../../reporter/reporter';

/**
 * Spec reporter 
 */
export class SpecReporter implements HurdleReporter {
  static id = 'spec';
  private testsFailed = 0;
  private testsPassed = 0;
  private caseIndent = '  ';
  private testIndent = '    ';

  projectStart(runnerTime: RunnerTime): Promise<void> {
    console.log(`Started project ${runnerTime.startTime.toLocaleString()}`);
    return Promise.resolve();
  }

  sectionStart(testSection: TestSection, runnerTime: RunnerTime): Promise<void> {
    console.log(`${testSection.name} - ${testSection.description}`);
    return Promise.resolve();
  }

  caseStart(testCase: TestCase, runnerTime: RunnerTime): Promise<void> {
    console.log(`${this.caseIndent}${testCase.name}`);
    return Promise.resolve();
  }

  testStart(testStep: TestStep, runnerTime: RunnerTime): Promise<void> {
    return Promise.resolve();
  }

  testPass(testStep: TestStep, check: TestAssertion): Promise<void> {
    this.testsPassed++;
    console.log(`${this.testIndent}✓ ${check.description}`);
    return Promise.resolve();
  }

  testFail(testStep: TestStep, check: TestAssertion): Promise<void> {
    this.testsFailed++;
    console.log(`${this.testIndent}✖ ${check.description}`);
    return Promise.resolve();
  }

  testSkip(testStep: TestStep, check: TestAssertion): Promise<void> {
    console.log(`${this.testIndent}- ${check.description}`);
    return Promise.resolve();
  }

  testEnd(testStep: TestStep, runnerTime: RunnerTime): Promise<void> {
    return Promise.resolve();
  }

  caseEnd(testCase: TestCase, runnerTime: RunnerTime): Promise<void> {
    return Promise.resolve();
  }

  sectionEnd(testSection: TestSection, runnerTime: RunnerTime): Promise<void> {
    return Promise.resolve();
  }

  projectEnd(runnerTime: RunnerTime): Promise<void> {
    console.log(`Ended project ${runnerTime.endTime ? runnerTime.endTime.toLocaleString() : ''} (${runnerTime.duration ? runnerTime.duration/1000 : 0}s)`);
    return Promise.resolve();
  }
}
