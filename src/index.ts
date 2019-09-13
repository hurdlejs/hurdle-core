import { Runner } from './runner/index';

export default class Hello {
  world: string = '';

  help(): void {
    const world = 'blue';
    this.world = world;
  }
}


let runner = new Runner();
runner.start();
