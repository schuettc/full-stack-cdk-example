const { awscdk } = require('projen');
const { UpgradeDependenciesSchedule } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkTypeScriptApp({
  author: 'Court Schuett',
  projenrcTs: true,
  authorAddress: 'https://subaud.io',
  jest: false,
  cdkVersion: '2.31.0',
  license: 'MIT-0',
  copyrightOwner: 'Court Schuett',
  defaultReleaseBranch: 'main',
  name: 'full-stack-cdk-example',
  deps: ['fs-extra', '@types/fs-extra'],
  devDeps: ['esbuild'],
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['schuettc'],
  },
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  repositoryUrl: 'https://github.com/schuettc/full-stack-cdk-example',
});

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  '*.drawio',
];

project.gitignore.exclude(...common_exclude);
project.synth();
