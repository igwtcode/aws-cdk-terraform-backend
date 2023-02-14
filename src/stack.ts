import { appConfig, stackProps } from '@src/config.js';
import * as _cdk from 'aws-cdk-lib';
import * as _dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as _s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class TerraformBackendStack extends _cdk.Stack {
  constructor(scope: Construct) {
    super(scope, `igwtcode-tf-backend`, {
      analyticsReporting: false,
      synthesizer: new _cdk.DefaultStackSynthesizer({
        generateBootstrapVersionRule: false,
      }),
      ...stackProps,
    });

    new _dynamodb.Table(this, 'DynamoDBTable', {
      tableName: appConfig.dynamodbTableName,
      partitionKey: {
        name: 'LockID',
        type: _dynamodb.AttributeType.STRING,
      },
      encryption: _dynamodb.TableEncryption.DEFAULT,
      billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST,
      tableClass: _dynamodb.TableClass.STANDARD,
      removalPolicy: _cdk.RemovalPolicy.DESTROY,
    });

    const bucket = new _s3.Bucket(this, 'S3Bucket', {
      bucketName: appConfig.s3BucketName,
      removalPolicy: _cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: _s3.BlockPublicAccess.BLOCK_ALL,
      encryption: _s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      publicReadAccess: false,
      enforceSSL: true,
      autoDeleteObjects: true,
    });
    bucket.addLifecycleRule({
      enabled: true,
      abortIncompleteMultipartUploadAfter: _cdk.Duration.days(7),
      noncurrentVersionExpiration: _cdk.Duration.days(30),
      noncurrentVersionsToRetain: 9,
      noncurrentVersionTransitions: [
        {
          transitionAfter: _cdk.Duration.days(30),
          storageClass: _s3.StorageClass.INFREQUENT_ACCESS,
        },
      ],
      transitions: [
        {
          transitionAfter: _cdk.Duration.days(30),
          storageClass: _s3.StorageClass.INFREQUENT_ACCESS,
        },
      ],
    });
  }
}
