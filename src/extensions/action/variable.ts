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
    try {
      return await vm.runInNewContext(`${this.properties.name}=${this.properties.value}`, state);
    } catch (error) {
      return error;
    }
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
        const returnValue = this.replacePropertyVariable(value[property], state);
        if (returnValue !== undefined) {
          value[property] = returnValue;
        }
      }
    } else if (isString(value)) {
      const variableMatch = value.match(/({{)\w+(}})/g);
      if (variableMatch) {
        for (const match of variableMatch) {
          const variableName = match.replace('{{', '').replace('}}', '');
          return value = value.replace(match, state[variableName]);
        }
      }
    }
  }
}
