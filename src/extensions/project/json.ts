import * as path from 'path';
import * as fs from 'graceful-fs';
import { HurdleProject, ProjectConfiguration } from '../../project/project';

export class JsonHurdleProject implements HurdleProject {
  id = 'json';
  /**
   * Load a project source and transform into a project configuration object
   */
  load(source: string | object): ProjectConfiguration {
    let projectConfiguration = new ProjectConfiguration();
    const projectPath = this.projectPath(source as string);

    if (projectPath !== null)
      projectConfiguration = JSON.parse(fs.readFileSync(projectPath, 'utf8'));

    return projectConfiguration;
  }

  /**
   * Save a project configuration object to destination
   */
  save(destination: string | object, projectConfiguration: ProjectConfiguration): boolean {
    const projectPath = this.projectPath(destination as string);
    fs.writeFileSync(projectPath as string, JSON.stringify(projectConfiguration), 'utf8');
    return true;
  }

  /**
   * Return absolute project path or null if the file doesn't exist
   * @param source Source project path
   */
  projectPath(source: string): string | null {
    let projectPath = source;
    if (!path.isAbsolute(source)) {
      projectPath = path.join(process.cwd(), projectPath);
    }

    if (fs.existsSync(projectPath)) 
      return projectPath;
    
    return null;
  }
}