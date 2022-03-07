import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as customresource from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

interface ConfigProps extends StackProps {
  config: Object;
  siteBucket: s3.Bucket;
}

export class Config extends Stack {
  constructor(scope: Construct, id: string, props: ConfigProps) {
    super(scope, id, props);

    new customresource.AwsCustomResource(this, 'ConfigFrontEnd', {
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Body: JSON.stringify(props.config),
          Bucket: props.siteBucket.bucketName,
          Key: 'config.json',
        },
        physicalResourceId: customresource.PhysicalResourceId.of(
          Date.now().toString(),
        ),
      },
      policy: customresource.AwsCustomResourcePolicy.fromSdkCalls({
        resources: customresource.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });
  }
}
