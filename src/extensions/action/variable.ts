import * as vm from 'vm';
import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';

/**
 * Variable Action
 */
export class VariableAction implements HurdleAction {
  static id = 'variable';
  properties: any = {
    name: '',
    value: ''
  };

  async execute(state: RunnerState): Promise<object> {
    return vm.runInNewContext(`${this.properties.name}=${this.properties.value}`, state);
  }
}
