import { HurdleExtension } from '../../extension/extension';
import { HttpAction  } from './http';
import { VariableAction } from './variable';

export default class DefaulHurdleActions implements HurdleExtension {
  action = [
    new HttpAction(),
    new VariableAction()
  ];
  
}