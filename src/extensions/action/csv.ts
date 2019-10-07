import neatCsv from 'neat-csv';
import fs from 'fs';
import { promisify } from 'util';
import { HurdleAction } from '../../action/action';
import { RunnerState } from '../../runner/state';

/**
 * Csv Action to convert a csv file to an array of objects
 */
export class CsvAction implements HurdleAction {
  static id = 'csv';
  properties: any = {
    fileLocation: ''
  };

  async execute(state: RunnerState): Promise<object> {
    try {
      const readFileAsync = promisify(fs.readFile);
      const data = await readFileAsync(this.properties.fileLocation);
      return neatCsv(data);
    } catch (error) {
      console.log(error);
    }
    return {};
  }
}
