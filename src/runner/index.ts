import { Configuration } from '../config/config';
import { Extension, ExtensionType } from '../extension/extension';
import { HurdleProject } from '../project/project';

export class Runner {

  constructor(private projectConfigurationPath?: string) {
  }

  public async start(): Promise<void> {
    const configuration = Configuration.getInstance();
    const extensions = await Extension.getInstance();
    if (this.projectConfigurationPath)
      configuration.setProjectConfigurationPath(this.projectConfigurationPath);

    // Project loader should be provided by cli or UI, hardcoded for testing
    const extension = extensions.getExtension('json-project', ExtensionType.Project);
    if (extension !== undefined) {
      const projectLoader =  new extension.instanceType() as HurdleProject;
      // Project path/file should be provided by cli or UI, hardcoded for testing
      const projectConfiguration = projectLoader.load('test/project/project.json');
      console.log(projectConfiguration);
    }
  } 
}