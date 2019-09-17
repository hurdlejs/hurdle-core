import { RunnerState } from '../runner/state';
/**
 * Defines a test case action interface
 */
export interface HurdleAction {
  /**
   * Unique name of the action
   */
  name: string;
  /**
   * Action properties
   */
  properties: object;
  execute: (state: RunnerState) => object;
  initialise: (state: RunnerState) => boolean;
  finalise: (state: RunnerState) => boolean;

  /**
   * Describe object returned from execute function, required for assertions 
   */
  returnSchema: object;
}