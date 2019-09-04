import Hello from '../src/index';

describe('test', () => {
  it('help sets world', () => {
    const hello = new Hello();
    hello.help();
    expect(hello.world).toBe('blue');
  });
});
