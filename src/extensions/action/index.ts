import { HurdleExtension } from '../../extension/extension';
import { HtppActionHurdleProject  } from './http';
import { VariableAction } from './variable';

export default class DefaulHurdleActions implements HurdleExtension {
  action = [
    HtppActionHurdleProject,
    VariableAction
  ];
  
}