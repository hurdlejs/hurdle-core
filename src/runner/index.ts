import { Configuration } from '../config/config';
import { Extension, ExtensionType } from '../extension/extension';
import { HurdleProject, ProjectConfiguration, TestSection, TestCase, TestStep, TestAssertion } from '../project/project';
import { HurdleAction } from '../action/action';
import { RunnerState, RunnerTime } from './state';
import { HurdleAssertion } from '../assertion/assertion';
import { HurdleReporter } from '../reporter/reporter';
import { ReporterRunner } from './reporter-runner';

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
    const reporterRunner = new ReporterRunner(reporters);

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
        await this.runProject(projectConfiguration, reporterRunner);
        reporterRunner.endRunner();
      }
    } else {
      console.log('Project load extension not found');
      return;
    }
  }

  public async runProject(projectConfiguration: ProjectConfiguration, reporterRunner: ReporterRunner): Promise<void> {
    const runnerState = new RunnerState();
    const runnerTime = new RunnerTime();
    
    reporterRunner.queueProjectStart(runnerTime);
    for (const testSection of projectConfiguration.sections) {
      await this.runTestSection(testSection, runnerState, reporterRunner);
    }
    runnerTime.end();
    reporterRunner.queueProjectEnd(runnerTime);
  }
  
  public async runTestSection(testSection: TestSection, runnerState: RunnerState, reporterRunner: ReporterRunner): Promise<void> {
    const runnerTime = new RunnerTime();
    
    reporterRunner.queueSectionStart(testSection, runnerTime);
    for (const testCase of testSection.cases) {
      await this.runTestCase(testCase, runnerState, reporterRunner);
    }
    runnerTime.end();
    reporterRunner.queueSectionEnd(testSection, runnerTime);
  }

  public async runTestCase(testCase: TestCase, runnerState: RunnerState, reporterRunner: ReporterRunner): Promise<void> {
    const runnerTime = new RunnerTime();
    
    reporterRunner.queueCaseStart(testCase, runnerTime);
    for (const testStep of testCase.steps) {
      await this.runTestStep(testStep, runnerState, reporterRunner);
    }
    runnerTime.end();
    reporterRunner.queueCaseEnd(testCase, runnerTime);
  }
    
  public async runTestStep(testStep: TestStep, runnerState: any, reporterRunner: ReporterRunner): Promise<void> {
    const extensions = await Extension.getInstance();
    const extension = extensions.getExtension(testStep.action.id, ExtensionType.Action);
    const runnerTime = new RunnerTime();
    
    reporterRunner.queueTestStart(testStep, runnerTime);
    if (extension) {
      const action =  new extension.instanceType() as HurdleAction;
      action.properties = testStep.action.properties;
      // Wait for sync actions
      const response = await Promise.resolve(action.execute(runnerState));
      /* eslint require-atomic-updates: 0 */
      runnerState[testStep.action.id] = response;
      if (testStep.check) {
        for (const testCheck of testStep.check) {
          await this.runTestCheck(testStep, testCheck, runnerState, reporterRunner);
        }
      }
    } else {
      console.log(`Test step action ${testStep.action.id} not found`);
    }

    runnerTime.end();
    reporterRunner.queueTestEnd(testStep, runnerTime);
  }

  public async runTestCheck(testStep: TestStep, testCheck: TestAssertion, runnerState: RunnerState, reporterRunner: ReporterRunner): Promise<void> {
    const extensions = await Extension.getInstance();
    const extension = extensions.getExtension(testCheck.id, ExtensionType.Assertion);
    if (extension !== undefined) {
      const assertion =  new extension.instanceType() as HurdleAssertion;
      assertion.properties = testCheck.properties;
      const result = await assertion.assert(runnerState);

      if (result.success === true) {
        reporterRunner.queueTestPass(testStep, testCheck);
      } else {
        reporterRunner.queueTestFail(testStep, testCheck);
      }
    } else {
      console.log(`Test check ${testCheck.id} not found`);
    }
  }
}
