import * as os from 'os';
import * as path from 'path';
import * as fs from 'graceful-fs';
import { parse } from 'jsonc-parser';
import { mergeObjects } from 'json-merger';

export enum ConfigurationTarget {
  Project,
  Profile
}

export interface ConfigurationOptions {
  extensionPath: string;
  profileConfigurationPath: string;
  projectConfigurationPath: string;
}

export class Configuration {
  private static instance: Configuration;
  private defaultConfiguration: ConfigurationOptions = {
    extensionPath: path.join(os.homedir(), '.hurdle', 'extensions'),
    profileConfigurationPath: path.join(os.homedir(), '.hurdle', 'configuration.json'),
    projectConfigurationPath: path.join('.hurdle', 'configuration.json')
  };
  private configuration: ConfigurationOptions = this.defaultConfiguration;


  private constructor() {
    this.createPaths(this.defaultConfiguration.extensionPath, this.defaultConfiguration.profileConfigurationPath);
    this.refreshConfiguration();
  }

  public static getInstance(): Configuration {
    if (!Configuration.instance) {
      Configuration.instance = new Configuration();
    }
    return Configuration.instance;
  }

  public setProjectConfigurationPath(configurationPath: string) {
    this.defaultConfiguration.projectConfigurationPath = configurationPath;
    this.refreshConfiguration();
  }

  public getConfiguration(property: string, target?: ConfigurationTarget): any {
    throw "Not implemented";
  }

  public setConfiguration(property: string, value: any, target: ConfigurationTarget) {
    throw "Not implemented";
  }

  public getConfigurationOptions(target?: ConfigurationTarget): ConfigurationOptions {
    return this.configuration;
  }

  /**
   * Load all configuration files and merge
   */
  private refreshConfiguration(): void {
    const profileConfiguration = this.loadConfigurationFromFile(this.defaultConfiguration.profileConfigurationPath);
    const projectConfiguration = this.loadConfigurationFromFile(this.defaultConfiguration.projectConfigurationPath);
    this.configuration = this.mergeConfigurationOptions(this.defaultConfiguration, profileConfiguration, projectConfiguration);
  }

  /**
   * Load configuration file and parse JSON to object.
   * @param path Path of hurdle configuration.json file
   */
  private loadConfigurationFromFile(configurationPath: string): ConfigurationOptions {
    if (fs.existsSync(configurationPath)) {
      return parse(fs.readFileSync(configurationPath, 'utf8'));
    }

    return this.defaultConfiguration;
  }

  private mergeConfigurationOptions(...configurationOptions: ConfigurationOptions[]): ConfigurationOptions {
    return mergeObjects(configurationOptions);
  }

  private createPaths(...paths: string[]): void {
    for (const configurationPath of paths) {
      if (!fs.existsSync(configurationPath)) {
        if (path.extname(configurationPath) !== '') {
          fs.writeFileSync(configurationPath, '');
        } else {
          fs.mkdirSync(configurationPath, { recursive: true });
        }
      }
    }
  }
}
