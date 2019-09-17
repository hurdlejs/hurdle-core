import * as path from 'path';
import * as fs from 'graceful-fs';
import { Configuration } from '../config/config';
import { HurdleAction } from '../action/action';
import { HurdleReporter } from '../reporter/reporter';
import { HurdleProject } from '../project/project';

/**
 * Extension interface
 */
export interface HurdleExtension {
  /**
   * Test case action class export 
   */
  action?: HurdleAction;
  /**
   * Project class export 
   */
  project?: HurdleProject;
  /**
   * Reporter class export
   */
  reporter?: HurdleReporter;
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
  Loader,
  /**
   * Test result reporter
   */
  Reporter
}

export class RegisteredExtension {
  public constructor(public name: string, public instance: object,  public type: ExtensionType, public packageJson: object) {

  }
}

export class Extension {
  private static instance: Extension;
  private extensions: Map<ExtensionType, Array<RegisteredExtension>> = new Map();
  private constructor() {
    this.extensions.set(ExtensionType.Action, []);
    this.extensions.set(ExtensionType.Loader, []);
    this.extensions.set(ExtensionType.Reporter, []);
  }

  public static getInstance(): Extension {
    if (!Extension.instance) {
      Extension.instance = new Extension();
    }
    return Extension.instance;
  }

  /**
   * Load all extensions found in extension paths
   */
  public loadExtensions() {
    throw "Not implemented";
  }

  /**
   * Dynamically load an extension from the extension path
   * @param name Name of the extension, should match npm package name or local directory name
   * @param extensionType TODO Type of extension. Not sure if this is required
   */
  public async loadExtension(name: string, extensionType: ExtensionType): Promise<void> {
    const configuration = Configuration.getInstance();

    const extensionPath = path.join(configuration.getExtensionPath(), name);
    const extensionJsonPackagePath = path.join(extensionPath, 'package.json');
    // TODO Read package.json and get package details
    const extension: HurdleExtension = await import(extensionPath);
    this.registerExtension(name, extension);
  }

  /**
   * Register extension in cached list mapped by type (Action, Loader and Reporter)
   * TODO Should we handle exports of the same extension type from an extension package
   * @param name Name of the extension, should match npm package name or local directory name
   * @param extensionExports Default export of extension package
   */
  public registerExtension(name: string, extensionExports: HurdleExtension) {
    // Extension package contains an action 
    if (extensionExports.action) {
      this.extensions.get(ExtensionType.Action)!.push(new RegisteredExtension(name, extensionExports.action, ExtensionType.Action, {}));
    }
    // Extension package contains a loader 
    if (extensionExports.loader) {
      this.extensions.get(ExtensionType.Loader)!.push(new RegisteredExtension(name, extensionExports.loader, ExtensionType.Loader, {}));
    }
    // Extension package contains a reporter
    if (extensionExports.reporter) {
      this.extensions.get(ExtensionType.Reporter)!.push(new RegisteredExtension(name, extensionExports.reporter, ExtensionType.Reporter, {}));
    }
  }

  /**
   * Install an extension into the extension path
   * @param name Name of the extension, must match npm package name
   * @param extensionType TODO Type of extension. Not sure if this is required
   */
   public installExtension(name: string, extensionType: ExtensionType): void {
    const configuration = Configuration.getInstance();
    const extensionPath = path.join(configuration.getExtensionPath(), name);
    // Extension already exists
    if (fs.existsSync(extensionPath))
      return;
  }
}
