import * as path from 'path';
import * as fs from 'graceful-fs';
import { Configuration } from '../config/config';
import { HurdleAction } from '../action/action';
import { HurdleReporter } from '../reporter/reporter';
import { HurdleProject } from '../project/project';
import { HurdleAssertion } from '../assertion/assertion';

/**
 * Extension interface
 */
export interface HurdleExtension {
  /**
   * Test case action class export 
   */
  action?: Array<typeof HurdleAction>;
  /**
   * Project class export 
   */
  project?: Array<typeof HurdleProject>;
  /**
   * Reporter class export
   */
  reporter?: Array<typeof HurdleReporter>;
    /**
   * Assertion class export
   */
  assertion?: Array<typeof HurdleAssertion>;
}

/**
 * Extension types
 */
export enum ExtensionType {
  /**
   * Test case action
   */
  Action,
  /**
   * Project loader
   */
  Project,
  /**
   * Test result reporter
   */
  Reporter,
  /**
   * Test assertion
   */
  Assertion
}

export class RegisteredExtension {
  public constructor(public id: string, public instanceType: typeof HurdleAction | typeof HurdleProject | typeof HurdleReporter | typeof HurdleAssertion, public type: ExtensionType, public packageJson: object) {

  }
}

export class Extension {
  private static instance: Extension;
  private extensions: Array<RegisteredExtension> = [];
  private coreExtensionDirectory = path.join(__dirname, '../extensions');


  public static async getInstance(): Promise<Extension> {
    if (!Extension.instance) {
      Extension.instance = new Extension();
      await Extension.instance.loadExtensions();
    }
    return Extension.instance;
  }

  /**
   * Get an extension by ID and Type. Returns undefined if not found.
   * @param id Extension ID
   * @param type Extension Type
   */
  public getExtension(id: string, type: ExtensionType): RegisteredExtension | undefined {
    return this.extensions.find(extension => extension.id === id && extension.type === type);
  }

  /**
   * Load all extensions found in extension paths
   */
  public async loadExtensions(): Promise<void> {
    const extensionDirectory = Configuration.getInstance().getExtensionDirectory();
    const extensionDirectories = 
      fs.readdirSync(extensionDirectory, { withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(dirent => {
          return {
            name: dirent.name,
            directory: path.join(extensionDirectory, dirent.name)
          }
        });
    extensionDirectories.push(...
      fs.readdirSync(this.coreExtensionDirectory, { withFileTypes: true})
      .filter(item => item.isDirectory())
      .map(dirent => {
        return {
          name: dirent.name,
          directory: path.join(this.coreExtensionDirectory, dirent.name)
        }
      })
    );

    for (const extension of extensionDirectories) {
      await this.loadExtension(extension.name, extension.directory);
    }
  }

  /**
   * Dynamically load an extension from the extension path
   * @param name Name of the extension, should match npm package name or local directory name
   * @param directory Full path of the extension
   */
  public async loadExtension(name: string, directory: string): Promise<void> {
    const extensionJsonPackagePath = path.join(directory, 'package.json');

    if (fs.existsSync(directory)) {
      const jsonPackage = fs.existsSync(extensionJsonPackagePath) ? JSON.parse(fs.readFileSync(extensionJsonPackagePath, 'utf8')) : {};
      const extension = await import(directory);
      if (extension && extension.default) {
        this.registerExtensions(name, new extension.default(), jsonPackage);
      }
    }
  }

  /**
   * Register extension types (Action, Loader and Reporter) found in a HurdleExtension
   * @param name Name of the extension, should match npm package name or local directory name
   * @param extensionExports Default export of extension package
   * @param packageJson Package.json object
   */
  public registerExtensions(name: string, extensionExports: HurdleExtension, packageJson: object): void {
    // Extension package contains an action 
    if (extensionExports.action && extensionExports.action.length > 0) {
      for (const extensionExport of extensionExports.action)
        this.registerExtension(extensionExport.id, extensionExport, ExtensionType.Action, packageJson);
    }
    // Extension package contains a loader 
    if (extensionExports.project && extensionExports.project.length > 0) {
      for (const extensionExport of extensionExports.project)
        this.registerExtension(extensionExport.id, extensionExport, ExtensionType.Project, packageJson);
    }
    // Extension package contains a reporter
    if (extensionExports.reporter && extensionExports.reporter.length > 0) {
      for (const extensionExport of extensionExports.reporter)
       this.registerExtension(extensionExport.id, extensionExport, ExtensionType.Reporter, packageJson);
    }
    // Extension package contains an assertion
    if (extensionExports.assertion && extensionExports.assertion.length > 0) {
      for (const extensionExport of extensionExports.assertion)
        this.registerExtension(extensionExport.id, extensionExport, ExtensionType.Assertion, packageJson);
    }
  }

   /**
   * Register extension in cached list
   * @param name ID of the extension, should match npm package name or local directory name
   * @param instanceType Class type of extension package
   * @param type Type of extension
   * @param packageJson Package.json object
   */
  public registerExtension(id: string, instanceType: typeof HurdleAction | typeof HurdleProject | typeof HurdleReporter | typeof HurdleAssertion, type: ExtensionType, packageJson: object): void {
    if (this.extensions.some(extension => extension.id === id)) {
      // Duplicate extension name 
      // TODO Return error message
      return;
    } else {
      this.extensions.push(new RegisteredExtension(id, instanceType, type, packageJson));
    }
  }

  /**
   * Install an extension into the extension path
   * @param name Name of the extension, must match npm package name
   */
   public installExtension(name: string): void {
    const configuration = Configuration.getInstance();
    const extensionPath = path.join(configuration.getExtensionDirectory(), name);
    // Extension already exists
    if (fs.existsSync(extensionPath))
      return;
  }
}
