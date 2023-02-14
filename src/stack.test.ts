import { TerraformBackendStack } from '@src/stack.js';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { appConfig } from '@src/config.js';

describe('TerraformBackendStack', () => {
  const app = new App();
  const stack = new TerraformBackendStack(app);
  const template = Template.fromStack(stack);

  it('should have dynamodb table with correct config', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      TableName: appConfig.dynamodbTableName,
      TableClass: 'STANDARD',
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {
          AttributeName: 'LockID',
          KeyType: 'HASH',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: 'LockID',
          AttributeType: 'S',
        },
      ],
      SSESpecification: {
        SSEEnabled: false,
      },
    });
  });

  it('should have s3 bucket with correct config', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: appConfig.s3BucketName,
      VersioningConfiguration: {
        Status: 'Enabled',
      },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      },
      LifecycleConfiguration: {
        Rules: [
          {
            Status: 'Enabled',
            AbortIncompleteMultipartUpload: {
              DaysAfterInitiation: 7,
            },
            NoncurrentVersionExpiration: {
              NoncurrentDays: 30,
              NewerNoncurrentVersions: 9,
            },
            NoncurrentVersionTransitions: [
              {
                StorageClass: 'STANDARD_IA',
                TransitionInDays: 30,
              },
            ],
            Transitions: [
              {
                StorageClass: 'STANDARD_IA',
                TransitionInDays: 30,
              },
            ],
          },
        ],
      },
    });
  });
});
