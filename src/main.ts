import { Stack, StackProps, Stage, StageProps, App } from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { Backend } from './backend';
import { Config } from './config';
import { Frontend } from './frontend';

export class Stages extends Stage {
  public readonly frontend: Frontend;
  public readonly backend: Backend;

  constructor(scope: Construct, id: string, stageProps: StageProps) {
    super(scope, id, stageProps);

    this.frontend = new Frontend(this, 'Frontend');
    this.backend = new Backend(this, 'Backend');

    new Config(this, 'Config', {
      config: this.backend.config,
      siteBucket: this.frontend.siteBucket,
    });
  }
}

export class FullStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    pipelines.CodePipelineSource.connection('org/repo', 'branch', {
      connectionArn:
        'arn:aws:codestar-connections:us-east-1:316091283514:connection/3b36b888-9a66-4f83-ac94-305963414e7d',
    });

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.gitHub(
          'schuettc/full-stack-cdk-example',
          'main',
        ),
        commands: [
          'yarn install --frozen-lockfile',
          'yarn build',
          'npx cdk synth',
        ],
      }),
    });

    const stages = new Stages(this, 'Stages', {});
    pipeline.addStage(stages);
  }
}

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new FullStack(app, 'my-stack-dev', { env: devEnv });

app.synth();
