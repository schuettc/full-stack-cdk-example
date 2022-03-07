import { execSync, ExecSyncOptions } from 'child_process';
import {
  CfnOutput,
  RemovalPolicy,
  Stack,
  StackProps,
  DockerImage,
} from 'aws-cdk-lib';
import * as cfn from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { copySync } from 'fs-extra';

export class Frontend extends Stack {
  public readonly siteBucket: s3.Bucket;
  public readonly distribution: cfn.Distribution;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.siteBucket = new s3.Bucket(this, 'websiteBucket', {
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    this.distribution = new cfn.Distribution(this, 'CloudfrontDistribution', {
      enableLogging: true,
      minimumProtocolVersion: cfn.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new origins.S3Origin(this.siteBucket),
        viewerProtocolPolicy: cfn.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cfn.CachePolicy.CACHING_DISABLED,
      },
      defaultRootObject: 'index.html',
    });
    const execOptions: ExecSyncOptions = { stdio: 'inherit' };

    const bundle = s3deploy.Source.asset('./site', {
      bundling: {
        command: [
          'sh',
          '-c',
          'echo "Docker build not supported. Please install esbuild."',
        ],
        image: DockerImage.fromRegistry('alpine'),
        local: {
          tryBundle(outputDir: string) {
            try {
              execSync('esbuild --version', execOptions);
            } catch {
              /* istanbul ignore next */
              return false;
            }
            execSync(
              'cd site && yarn install --frozen-lockfile && yarn build',
              execOptions,
            );
            copySync('./site/build', outputDir, {
              ...execOptions,
              recursive: true,
            });
            return true;
          },
        },
      },
    });

    new s3deploy.BucketDeployment(this, 'DeployBucket', {
      sources: [bundle],
      destinationBucket: this.siteBucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'distribution', {
      value: this.distribution.domainName,
    });

    new CfnOutput(this, 'siteBucket', { value: this.siteBucket.bucketName });
  }
}
