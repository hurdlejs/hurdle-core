import * as vm from 'vm';
import { RunnerState } from '../../runner/state';
import { HurdleAssertion, HurdleAssertionResult } from '../../assertion/assertion';

/**
 * JavaScript assertion. Runs code within V8 virtual machine context and returns a boolean
 */
export class JavaScriptAssertion implements HurdleAssertion {
  static id = 'js';
  properties: any = {
    js: ''
  };

  async assert(state: RunnerState): Promise<HurdleAssertionResult> {
    try {
      const success = vm.runInNewContext(this.properties.js, state);
      if (typeof success === 'boolean') {
        return {
          success: success
        };
      } else {
        return {
          success: false,
          messages: ['The last statement in the input script must return a boolean']
        };
      }

    } catch (error) {
      return {
        success: false,
        messages: [error]
      };
    }
  }
}
