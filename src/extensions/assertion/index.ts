import { HurdleExtension } from '../../extension/extension';
import { JavaScriptAssertion } from './javascript';


export default class DefaulHurdleAssertions implements HurdleExtension {
  assertion = [
    new JavaScriptAssertion()
  ];
}