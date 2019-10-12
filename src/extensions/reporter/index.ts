import { HurdleExtension } from '../../extension/extension';
import { SpecReporter } from './spec';


export default class DefaulHurdleReporters implements HurdleExtension {
  reporter = [
    new SpecReporter()
  ];
}