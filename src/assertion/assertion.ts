import { RunnerState } from '../runner/state';

/**
 * Defines a assertion type interface
 */
export interface HurdleAssertion {
  /**
   * Unique identifier of the assertion type
   */
  id: string;
  /**
   * Assertion properties
   */
  properties: any;
  /**
   * Run assertion on input parameters
   */
  assert: (state: RunnerState) => Promise<HurdleAssertionResult>;
}


/**
 * Defines a assertion result
 */
export interface HurdleAssertionResult {
  /**
   * Result of the assertion
   */
  success: boolean;
  /**
   * Messages returned from the assertion. Used for logging and reporters 
   */
  messages?: Array<string>;
}