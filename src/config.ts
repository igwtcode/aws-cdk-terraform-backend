import * as _cdk from 'aws-cdk-lib';

export const appConfig = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION,
  dynamodbTableNames: process.env.TF_LOCK_TABLE_NAMES?.split(',') || [],
  s3BucketName: process.env.TF_STATE_BUCKET_NAME,
};

export const stackProps: _cdk.StackProps = {
  terminationProtection: false,
  description: 'DynamoDB Tables and S3 Bucket for Terraform Backend',
  env: {
    account: appConfig.account,
    region: appConfig.region,
  },
  tags: {
    Project: 'aws-cdk-terraform-backend',
    Terrform: 'true',
    CDK: 'true',
  },
};
