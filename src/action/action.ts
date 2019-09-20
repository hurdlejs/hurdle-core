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
  abstract properties: object;
  abstract execute: (state: RunnerState) => object;
  abstract initialise: (state: RunnerState) => boolean;
  abstract finalise: (state: RunnerState) => boolean;

  /**
   * TODO move to package.json or config file?
   * Describe object returned from execute function, required for assertions 
   */
  abstract returnSchema: object;
}