/**
 * Defines a test report interface
 */
export abstract class HurdleReporter {
  /**
   * Unique identifier of the reporter
   */
  static id: string;
  abstract activate?: void;
  abstract projectStart?: void;
  abstract suiteStart?: void;
  abstract testStart?: void;
  abstract testPass?: void;
  abstract testFail?: void;
  abstract testSkip?: void;
  abstract testEnd?: void;
  abstract suiteEnd?: void;
  abstract projectEnd?: void;
  abstract deactivate?: void;
}