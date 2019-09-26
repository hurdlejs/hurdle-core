import { Configuration } from '../config/config';
import { Extension, ExtensionType } from '../extension/extension';
import { HurdleProject, ProjectConfiguration, TestSection, TestCase, TestStep, HurdleCheck } from '../project/project';
import { HurdleAction } from '../action/action';
import { RunnerState } from './state';

export class Runner {

  constructor(private projectConfigurationPath?: string) {
  }

  public async start(): Promise<void> {
    const configuration = Configuration.getInstance();
    const extensions = await Extension.getInstance();
    if (this.projectConfigurationPath)
      configuration.setProjectConfigurationPath(this.projectConfigurationPath);

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
        await this.runProject(projectConfiguration);
      }
    } else {
      console.log('Project load extension not found');
      return;
    }
  }

  public async runProject(projectConfiguration: ProjectConfiguration): Promise<void> {
    const runnerState = new RunnerState();
    for (const testSection of projectConfiguration.sections) {
      await this.runTestSection(testSection, runnerState);
    }
  }
  
  public async runTestSection(testSection: TestSection, runnerState: RunnerState): Promise<void> {
    for (const testCase of testSection.cases) {
      await this.runTestCase(testCase, runnerState);
    }
  }

  public async runTestCase(testCase: TestCase, runnerState: RunnerState): Promise<void> {
    for (const testStep of testCase.steps) {
      await this.runTestStep(testStep, runnerState);
    }
  }
    
  public async runTestStep(testStep: TestStep, runnerState: RunnerState): Promise<void> {
    const extensions = await Extension.getInstance();
    const extension = extensions.getExtension(testStep.action.id, ExtensionType.Action);
    if (extension) {
      const action =  new extension.instanceType() as HurdleAction;
      action.properties = testStep.action.properties;
      // Wait for sync actions
      const response = await Promise.resolve(action.execute(runnerState));
      runnerState[testStep.action.id] = response;
      for (const testCheck of testStep.check) {
        await this.runTestCheck(testCheck, runnerState);
      }
    } else {
      console.log(`Test step action ${testStep.action.id} not found`);
    }

  }

  public async runTestCheck(testCheck: HurdleCheck, runnerState: RunnerState): Promise<void> {
    await Promise.resolve(console.log('TODO'));
  }
}