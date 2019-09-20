import { HurdleProject, ProjectConfiguration } from '../../project/project';

export class JsonHurdleProject implements HurdleProject {
  static id = 'json-project';
  /**
   * Load a project source and transform into a project configuration object
   */
  load(source: string | object): ProjectConfiguration {
    const projectConfiguration = new ProjectConfiguration();
    // TODO
    return projectConfiguration;
  }

  /**
   * Save a project configuration object to destination
   */
  save(destination: string | object, projectConfiguration: ProjectConfiguration): boolean {
    // TODO
    return false;
  }
}