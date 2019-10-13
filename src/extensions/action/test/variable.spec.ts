import { VariableAction } from '../variable';
import { TestStep, TestAction } from '../../../project/project';

describe('Test variable action', () => {
  it('beforeeach replace property variable', () => {
    const variableAction = new VariableAction();
    const state = {
      replace: 'Variable'
    };
    const testStep = new TestStep();
    testStep.action = new TestAction();
    testStep.action.properties = {
      value: 'ReplaceWith{{replace}}' 
    };
    variableAction.beforeEachAction(testStep, state);
    expect(testStep.action.properties.value).toBe('ReplaceWithVariable');
  });

  it('beforeeach replace not required', () => {
    const variableAction = new VariableAction();
    const state = {
      replace: 'Variable'
    };
    const testStep = new TestStep();
    testStep.action = new TestAction();
    testStep.action.properties = {
      value: 'ReplaceWith' 
    };
    variableAction.beforeEachAction(testStep, state);
    expect(testStep.action.properties.value).toBe('ReplaceWith');
  });

  it('beforeeach number replace and execute', async () => {
    const variableAction = new VariableAction();
    const state = {
      replace: 1,
      variable: undefined
    };
    const testStep = new TestStep();
    testStep.action = new TestAction();
    testStep.action.properties = {
      name: 'variable',
      value: '{{replace}}+1' 
    };
    variableAction.properties = testStep.action.properties;
    variableAction.beforeEachAction(testStep, state);
    const result = await variableAction.execute(state);
    expect(testStep.action.properties.value).toBe('1+1');
    expect(result).toBe(2);
  });
});
