import { appConfig } from '@src/config';
import { TerraformBackendStack } from '@src/stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

describe('TerraformBackendStack', () => {
  const app = new App();
  const stack = new TerraformBackendStack(app);
  const template = Template.fromStack(stack);

  for (let idx = 0; idx < appConfig.tableNames.length; idx++) {
    const tableName = appConfig.tableNames[idx];
    it(`should have dynamodb table - ${idx}`, () => {
      template.hasResourceProperties('AWS::DynamoDB::Table', {
        TableName: tableName,
        TableClass: 'STANDARD', // TODO: modify to your own needs based on stack settings
        BillingMode: 'PAY_PER_REQUEST', // TODO: modify to your own needs based on stack settings
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
  }

  for (let idx = 0; idx < appConfig.bucketNames.length; idx++) {
    const bucketName = appConfig.bucketNames[idx];
    it(`should have s3 bucket - ${idx}`, () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketName: bucketName,
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
                SSEAlgorithm: 'AES256', // TODO: modify to your own needs based on stack settings
              },
            },
          ],
        },
        LifecycleConfiguration: {
          Rules: [
            {
              Status: 'Enabled',
              AbortIncompleteMultipartUpload: {
                DaysAfterInitiation: 7, // TODO: modify to your own needs based on stack settings
              },
              NoncurrentVersionExpiration: {
                NoncurrentDays: 30, // TODO: modify to your own needs based on stack settings
                NewerNoncurrentVersions: 9, // TODO: modify to your own needs based on stack settings
              },
              NoncurrentVersionTransitions: [
                {
                  StorageClass: 'STANDARD_IA',
                  TransitionInDays: 30, // TODO: modify to your own needs based on stack settings
                },
              ],
              Transitions: [
                {
                  StorageClass: 'STANDARD_IA',
                  TransitionInDays: 30, // TODO: modify to your own needs based on stack settings
                },
              ],
            },
          ],
        },
      });
    });
  }
});
