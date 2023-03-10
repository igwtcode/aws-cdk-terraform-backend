import { appConfig, stackProps } from '@src/config';
import * as _cdk from 'aws-cdk-lib';
import * as _dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as _s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class TerraformBackendStack extends _cdk.Stack {
  constructor(scope: Construct) {
    super(scope, stackProps.stackName, stackProps);

    for (let idx = 0; idx < appConfig.tableNames.length; idx++) {
      const tableName = appConfig.tableNames[idx];
      const table = new _dynamodb.Table(this, `DynamoDBTable-${tableName}`, {
        tableName,
        partitionKey: {
          name: 'LockID',
          type: _dynamodb.AttributeType.STRING,
        },
        encryption: _dynamodb.TableEncryption.DEFAULT, // TODO: modify to your own needs
        billingMode: _dynamodb.BillingMode.PAY_PER_REQUEST, // TODO: modify to your own needs
        tableClass: _dynamodb.TableClass.STANDARD, // TODO: modify to your own needs
        removalPolicy: _cdk.RemovalPolicy.DESTROY, // TODO: modify to your own needs
      });
      new _cdk.CfnOutput(this, `DynamoDBTableNameOutput-${tableName}`, {
        value: table.tableName,
        exportName: `DynamoDBTableName-${idx}`,
      });
    }

    for (let idx = 0; idx < appConfig.bucketNames.length; idx++) {
      const bucketName = appConfig.bucketNames[idx];
      const bucket = new _s3.Bucket(this, `S3Bucket-${bucketName}`, {
        bucketName,
        blockPublicAccess: _s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: _cdk.RemovalPolicy.DESTROY, // TODO: modify to your own needs
        encryption: _s3.BucketEncryption.S3_MANAGED, // TODO: modify to your own needs
        versioned: true,
        publicReadAccess: false,
        enforceSSL: true, // TODO: modify to your own needs
        autoDeleteObjects: true, // TODO: modify to your own needs
      });
      bucket.addLifecycleRule({
        enabled: true,
        abortIncompleteMultipartUploadAfter: _cdk.Duration.days(7), // TODO: modify to your own needs
        noncurrentVersionExpiration: _cdk.Duration.days(30), // TODO: modify to your own needs
        noncurrentVersionsToRetain: 9, // TODO: modify to your own needs
        noncurrentVersionTransitions: [
          {
            transitionAfter: _cdk.Duration.days(30), // TODO: modify to your own needs
            storageClass: _s3.StorageClass.INFREQUENT_ACCESS,
          },
        ],
        transitions: [
          {
            transitionAfter: _cdk.Duration.days(30), // TODO: modify to your own needs
            storageClass: _s3.StorageClass.INFREQUENT_ACCESS,
          },
        ],
      });
      new _cdk.CfnOutput(this, `S3BucketNameOutput-${bucketName}`, {
        value: bucket.bucketName,
        exportName: `S3BucketName-${idx}`,
      });
    }
  }
}
