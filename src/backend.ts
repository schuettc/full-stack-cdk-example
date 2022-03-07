import path from 'path';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import {
  RestApi,
  LambdaIntegration,
  EndpointType,
  MethodLoggingLevel,
} from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class Backend extends Stack {
  public readonly config: Object;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });

    const demoLambda = new Function(this, 'demoLambda', {
      role: lambdaRole,
      handler: 'index.handler',
      timeout: Duration.seconds(60),
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.join(__dirname, '../resources/lambda/')),
    });

    const api = new RestApi(this, 'demoApi', {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'POST'],
        allowCredentials: true,
        allowOrigins: ['*'],
      },
      deployOptions: {
        loggingLevel: MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      endpointConfiguration: {
        types: [EndpointType.REGIONAL],
      },
    });

    const demo = api.root.addResource('demo');

    const lambdaIntegration = new LambdaIntegration(demoLambda);

    demo.addMethod('POST', lambdaIntegration, {});

    this.config = {
      API_URL: api.url,
    };
  }
}
