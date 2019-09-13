import path from 'path';
import { ExtensionType } from './extension-types';

/**
 * Dynamically load an extension from the extension path
 * @param name Name of the extension, should match npm package name or local directory name
 * @param extensionType TODO Type of extension. Not sure if this is required
 */
export async function loadExtension(name: string, extensionType: ExtensionType): Promise<void> {
  // TODO Move to config class and allow user overrides
  const defaultExtensionPath = '../extensions';

  const extensionPath = path.join(defaultExtensionPath, name);
  const extensionJsonPackagePath = path.join(extensionPath, 'package.json');
  // TODO Read package.json and get package details
  const extension = await import(extensionPath);
}

/**
 * Install an extension into the extension path
 * @param name Name of the extension, must match npm package name
 * @param extensionType TODO Type of extension. Not sure if this is required
 */
export function installExtension(name: string, extensionType: ExtensionType): void {
  // TODO Move to config class and allow user overrides
  const defaultExtensionPath = '../extensions';

  const extensionPath = path.join(defaultExtensionPath, name);

}

