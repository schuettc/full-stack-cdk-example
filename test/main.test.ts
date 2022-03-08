import { App } from 'aws-cdk-lib';
import { FullStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  new FullStack(app, 'test');
});
