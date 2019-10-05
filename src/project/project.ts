import { HurdleAction } from '../action/action';


/**
 * Defines a project type interface
 */
export abstract class HurdleProject {
  /**
   * Unique identifier of the project type
   */
  static id: string;
  /**
   * Load a project source and transform into a project configuration object
   */
  abstract load: (source: string | object) => ProjectConfiguration;

  /**
   * Save a project configuration object to destination
   */
  abstract save: (destination: string | object, projectConfiguration: ProjectConfiguration) => boolean;
}


export class ProjectConfiguration {
  /**
   * Global actions executed before tests.
   * Can be used to store variables, session keys, database connections etc.
   */
  public global: Array<HurdleAction> = [];
  /**
   * Test sections, each section includes test cases and steps
   */
  public sections: Array<TestSection> = [];
  /**
   * Optional list of project configuration files.
   * Can be used to split tests into multiple files
   */
  public projectFiles: Array<string> = [];
}

export class TestSection {
  /**
   * Name of the test section
   */
  public name: string | undefined;
  /**
   * Description of the test section
   */
  public description: string | undefined;
  /**
   * List of test cases for the section
   */
  public cases: Array<TestCase> = [];
}


export class TestCase {
  /**
   * Test case unique identifier, used for reporting
   */
  public id: string | undefined;
  /**
   * Test case name
   */
  public name: string | undefined;
  /**
   * Test case importance (CRITICAL, HIGH, MEDIUM and LOW), used for reporting
   * TODO Not sure if this is required
   */
  public priority: TestCasePriority | undefined;
  /**
   * Skip this test case during execution 
   */
  public skip: boolean | undefined;
  /**
   * List of steps to execute for the test case. Steps are executed in the configured order.
   */
  public steps: Array<TestStep> = [];
}

export class TestStep {
  /**
   * Action to perform
   */
  public action!: TestAction;
  /**
   * List of checks made on the return object of an action 
   */
  public check: Array<TestAssertion> = [];
}

/**
 * Defines a test case action interface
 */
export class TestAction {
  /**
   * Unique identifier of the action
   */
  id!: string;
  /**
   * Action properties
   */
  properties: any;
}

/**
 * Check against runner state.
 */
export class TestAssertion {
  /**
   * Unique identifier of the assertion type
   */
  id!: string;  
  /**
   * Description of the assertion
   */
  public description: string | undefined;
  /**
   * Assertion properties
   */
  properties: any;
}

export enum TestCasePriority {
  critical = 'CRITICAL',
  high = 'HIGH',
  medium = 'MEDIUM',
  low = 'LOW'
}
