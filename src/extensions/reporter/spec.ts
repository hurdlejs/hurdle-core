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

  projectStart(runnerTime: RunnerTime): void {
    console.log(`Started project ${runnerTime.startTime.toLocaleString()}`);
  }
  sectionStart(testSection: TestSection, runnerTime: RunnerTime): void {
    console.log(`${testSection.name} - ${testSection.description}`);
  }
  caseStart(testCase: TestCase, runnerTime: RunnerTime): void {
    console.log(`${this.caseIndent}${testCase.name}`);
  }
  testStart(testStep: TestStep, runnerTime: RunnerTime): void {
    return;
  }
  testPass(testStep: TestStep, check: TestAssertion): void {
    this.testsPassed++;
    console.log(`${this.testIndent}✓ ${check.description}`);
  }
  testFail(testStep: TestStep, check: TestAssertion): void {
    this.testsFailed++;
    console.log(`${this.testIndent}✖ ${check.description}`);
  }
  testSkip(testStep: TestStep, check: TestAssertion): void {
    console.log(`${this.testIndent}- ${check.description}`);
  }
  testEnd(testStep: TestStep, runnerTime: RunnerTime): void {
    return
  }
  caseEnd(testCase: TestCase, runnerTime: RunnerTime): void {
    return;
  }
  sectionEnd(testSection: TestSection, runnerTime: RunnerTime): void {
    return;
  }
  projectEnd(runnerTime: RunnerTime): void {
    console.log(`Ended project ${runnerTime.endTime ? runnerTime.endTime.toLocaleString() : ''} (${runnerTime.duration ? runnerTime.duration/1000 : 0}s)`);
  }
}
