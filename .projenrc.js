const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  author: 'Court Schuett',
  authorAddress: 'https://subaud.io',
  cdkVersion: '2.15.0',
  license: 'MIT-0',
  copyrightOwner: 'Court Schuett',
  defaultReleaseBranch: 'main',
  name: 'full-stack-cdk-example',
  deps: ['fs-extra', '@types/fs-extra'],
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
project.synth();
