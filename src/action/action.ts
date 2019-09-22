import { RunnerState } from '../runner/state';
/**
 * Defines a test case action interface
 */
export abstract class HurdleAction {
  /**
   * Unique identifier of the action
   */
  static id: string;
  /**
   * Action properties
   */
  properties: object | undefined;
  
  abstract execute: (state: RunnerState) => object;

  /**
   * Not sure if methods below are required
   */
  //initialise: ((state: RunnerState) => boolean) | undefined;
  //finalise: ((state: RunnerState) => boolean) | undefined;

  /**
   * TODO move to package.json or config file?
   * Describe object returned from execute function, required for assertions 
   */
  //abstract returnSchema: object;
}