/**
 * Defines a test report interface
 */
export interface HurdleReporter {
  /**
   * Unique name of the reporter
   */
  name: string;
  activate?: void;
  projectStart?: void;
  suiteStart?: void;
  testStart?: void;
  testPass?: void;
  testFail?: void;
  testSkip?: void;
  testEnd?: void;
  suiteEnd?: void;
  projectEnd?: void;
  deactivate?: void;
}