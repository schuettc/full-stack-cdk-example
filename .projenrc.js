const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  author: 'Court Schuett',
  authorAddress: 'https://subaud.io',
  cdkVersion: '2.31.0',
  license: 'MIT-0',
  copyrightOwner: 'Court Schuett',
  defaultReleaseBranch: 'main',
  name: 'full-stack-cdk-example',
  deps: ['fs-extra', '@types/fs-extra'],
  devDeps: ['@types/prettier@2.6.0', 'esbuild', 'got@11.8.5', 'ts-node@^10'],
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['schuettc'],
  },
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
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
