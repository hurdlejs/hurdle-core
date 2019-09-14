import * as path from 'path';
import * as fs from 'graceful-fs';
import { ExtensionType } from './extension-types';
import { Configuration } from '../config/config';

/**
 * Dynamically load an extension from the extension path
 * @param name Name of the extension, should match npm package name or local directory name
 * @param extensionType TODO Type of extension. Not sure if this is required
 */
export async function loadExtension(name: string, extensionType: ExtensionType): Promise<void> {
  const configuration = Configuration.getInstance();

  const extensionPath = path.join(configuration.getExtensionPath(), name);
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
  const configuration = Configuration.getInstance();
  const extensionPath = path.join(configuration.getExtensionPath(), name);
  // Extension already exists
  if (fs.existsSync(extensionPath))
    return;
}

