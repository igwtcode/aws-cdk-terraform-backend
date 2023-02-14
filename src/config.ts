import * as _cdk from 'aws-cdk-lib';

export const appConfig = {
  account: process.env.AWS_DEFAULT_ACCOUNT,
  region: process.env.AWS_DEFAULT_REGION,
  dynamodbTableName: process.env.TABLE_NAME,
  s3BucketName: process.env.BUCKET_NAME,
};

export const stackProps: _cdk.StackProps = {
  terminationProtection: false,
  description: 'DynamoDB Table and S3 Bucket for Terraform Backend',
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
