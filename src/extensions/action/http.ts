import * as got from 'got';
import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';


export class HtppActionHurdleProject implements HurdleAction {
  static id = 'http';
  properties: any = {
    url: ''
  };

  async execute(state: RunnerState): Promise<object> {
    try {
      const response = await got(this.properties);
      return response;
    } catch (error) {
      console.log(error.response.body);
    }
    return {};
  }
}