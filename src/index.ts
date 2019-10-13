import { Runner } from './runner/index';

function error(error): void {
  console.error(error);
}

if (!process.env.test) {
  const runner = new Runner();
  runner.start().catch(error);
}



