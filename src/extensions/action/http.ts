import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';

export class HtppActionHurdleProject implements HurdleAction {
  properties: object | undefined;
  static id = 'http';

  execute(state: RunnerState): object {
    return {};
  }
}