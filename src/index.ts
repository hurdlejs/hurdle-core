import { Runner } from './runner/index';

export default class Hello {
  world = '';

  help(): void {
    const world = 'blue';
    this.world = world;
  }
}


const runner = new Runner();
runner.start();
