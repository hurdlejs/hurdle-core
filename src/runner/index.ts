import { Configuration } from '../config/config';
import { Extension, ExtensionType } from '../extension/extension';
import { HurdleProject, ProjectConfiguration, TestSection, TestCase, TestStep, TestAssertion } from '../project/project';
import { HurdleAction } from '../action/action';
import { RunnerState, RunnerTime } from './state';
import { HurdleAssertion } from '../assertion/assertion';
import { HurdleReporter } from '../reporter/reporter';

export class Runner {

  constructor(private projectConfigurationPath?: string) {
  }

  public async start(): Promise<void> {
    const configuration = Configuration.getInstance();
    const extensions = await Extension.getInstance();
    if (this.projectConfigurationPath)
      configuration.setProjectConfigurationPath(this.projectConfigurationPath);

    // TODO Move to config items
    const configReporters = [
      'spec'
    ];
    const reporters: Array<HurdleReporter> = [];

    for (const reporter of configReporters) {
      const reporterExtension = extensions.getExtension(reporter, ExtensionType.Reporter)
      if (reporterExtension) {
        reporters.push(new reporterExtension.instanceType() as HurdleReporter);
      } else {
        console.log(`Reporter ${reporter} not found`);
      }
    }

    // Project loader should be provided by cli or UI, hardcoded for testing
    const extension = extensions.getExtension('json', ExtensionType.Project);
    if (extension !== undefined) {
      const projectLoader =  new extension.instanceType() as HurdleProject;
      // Project path/file should be provided by cli or UI, hardcoded for testing
      const projectConfiguration = projectLoader.load('test/project/project.json');
      if (!projectConfiguration) {
        console.log('Unable to load project');
        return;
      } else {
        await this.runProject(projectConfiguration, reporters);
      }
    } else {
      console.log('Project load extension not found');
      return;
    }
  }

  public async runProject(projectConfiguration: ProjectConfiguration, reporters: Array<HurdleReporter>): Promise<void> {
    const runnerState = new RunnerState();
    const runnerTime = new RunnerTime();
    
    reporters.forEach(reporter => reporter.projectStart(runnerTime));
    for (const testSection of projectConfiguration.sections) {
      await this.runTestSection(testSection, runnerState, reporters);
    }
    runnerTime.end();
    reporters.forEach(reporter => reporter.projectEnd(runnerTime));
  }
  
  public async runTestSection(testSection: TestSection, runnerState: RunnerState, reporters: Array<HurdleReporter>): Promise<void> {
    const runnerTime = new RunnerTime();
    
    reporters.forEach(reporter => reporter.sectionStart(testSection, runnerTime));
    for (const testCase of testSection.cases) {
      await this.runTestCase(testCase, runnerState, reporters);
    }
    runnerTime.end();
    reporters.forEach(reporter => reporter.sectionEnd(testSection, runnerTime));
  }

  public async runTestCase(testCase: TestCase, runnerState: RunnerState, reporters: Array<HurdleReporter>): Promise<void> {
    const runnerTime = new RunnerTime();
    
    reporters.forEach(reporter => reporter.caseStart(testCase, runnerTime));
    for (const testStep of testCase.steps) {
      await this.runTestStep(testStep, runnerState, reporters);
    }
    runnerTime.end();
    reporters.forEach(reporter => reporter.caseEnd(testCase, runnerTime));
  }
    
  public async runTestStep(testStep: TestStep, runnerState: any, reporters: Array<HurdleReporter>): Promise<void> {
    const extensions = await Extension.getInstance();
    const extension = extensions.getExtension(testStep.action.id, ExtensionType.Action);
    const runnerTime = new RunnerTime();
    
    reporters.forEach(reporter => reporter.testStart(testStep, runnerTime));
    if (extension) {
      const action =  new extension.instanceType() as HurdleAction;
      action.properties = testStep.action.properties;
      // Wait for sync actions
      const response = await Promise.resolve(action.execute(runnerState));
      /* eslint require-atomic-updates: 0 */
      runnerState[testStep.action.id] = response;
      if (testStep.check) {
        for (const testCheck of testStep.check) {
          await this.runTestCheck(testStep, testCheck, runnerState, reporters);
        }
      }
    } else {
      console.log(`Test step action ${testStep.action.id} not found`);
    }

    runnerTime.end();
    reporters.forEach(reporter => reporter.testEnd(testStep, runnerTime));
  }

  public async runTestCheck(testStep: TestStep, testCheck: TestAssertion, runnerState: RunnerState, reporters: Array<HurdleReporter>): Promise<void> {
    const extensions = await Extension.getInstance();
    const extension = extensions.getExtension(testCheck.id, ExtensionType.Assertion);
    if (extension !== undefined) {
      const assertion =  new extension.instanceType() as HurdleAssertion;
      assertion.properties = testCheck.properties;
      const result = await assertion.assert(runnerState);

      if (result.success === true) {
        reporters.forEach(reporter => reporter.testPass(testStep, testCheck));
      } else {
        reporters.forEach(reporter => reporter.testFail(testStep, testCheck));
      }
    } else {
      console.log(`Test check ${testCheck.id} not found`);
    }
  }
}