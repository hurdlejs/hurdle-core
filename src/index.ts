import { Runner } from './runner/index';

export default class Hello {
  world = '';

  help(): void {
    const world = 'blue';
    this.world = world;
  }
}

function error(error): void {
  console.error(error);
}

const runner = new Runner();
runner.start().catch(error);


