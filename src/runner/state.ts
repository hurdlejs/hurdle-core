/**
 * Shared test runner state 
 */
export class RunnerState {
  
}

/**
 * Runner time for project items - sections,cases,actions and assertions
 */
export class RunnerTime {
  /**
   * Project item start time
   */
  startTime: Date;
  /**
   * Project item end time
   */
  endTime?: Date;
  /**
   * Project item duration
   */
  duration?: number;

  constructor() {
    this.startTime = new Date();
  }

  start(): void {
    this.startTime = new Date();
  }

  end(): void {
    this.endTime = new Date();
    this.duration = this.endTime.getTime() - this.startTime.getTime();
  }
}