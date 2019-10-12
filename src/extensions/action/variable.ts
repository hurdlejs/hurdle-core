import * as vm from 'vm';
import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';
import { TestStep } from '../../project/project';
import { isArray, isObject, isString } from 'util';

/**
 * Variable Action
 */
export class VariableAction implements HurdleAction {
  id = 'variable';
  properties: any = {
    name: '',
    value: ''
  };

  async execute(state: RunnerState): Promise<object> {
    return await vm.runInNewContext(`${this.properties.name}=${this.properties.value}`, state)
  }

  beforeEachAction(testStep: TestStep, state: RunnerState): void {
    if (testStep.action && testStep.action.properties) {
      this.replacePropertyVariable(testStep.action.properties, state);
    }
  }

  private replacePropertyVariable(value: any, state: RunnerState): any {
    if (isArray(value)) {
      for (const row of value) {
        this.replacePropertyVariable(row, state);
      }
    } else if (isObject(value)) {
      for (const property in value) {
        this.replacePropertyVariable(value[property], state);
      }
    } else if (isString(value)) {
      const variableMatch = value.match(/({{)\w+(}})/g);
      if (variableMatch) {
        for (const match of variableMatch) {
          const variableName = match.replace('{{', '').replace('}}', '');
          value = value.replace(match, state[variableName]);
        }
      }
    }
  }
}
