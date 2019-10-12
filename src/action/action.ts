import { RunnerState } from '../runner/state';
import { TestStep } from '../project/project';
/**
 * Defines a test case action interface
 */
export interface HurdleAction {
  /**
   * Unique identifier of the action
   */
  id: string;
  /**
   * Action properties
   */
  properties: any;
  /**
   * Execute action
   */
  execute: (state: RunnerState) => object;
  /**
   * Executed before each action
   */
  beforeEachAction?: (testStep: TestStep, state: RunnerState) => void;
  /**
   * Executed after each action
   */
  afterEachAction?: (testStep: TestStep, state: RunnerState) => void;
  
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