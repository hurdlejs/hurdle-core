import { Configuration } from '../config/config';

export class Runner {

  constructor(private projectConfigurationPath?: string) {
  }

  public start(): void {
    const configuration = Configuration.getInstance();
    if (this.projectConfigurationPath)
      configuration.setProjectConfigurationPath(this.projectConfigurationPath);

    
  } 
}