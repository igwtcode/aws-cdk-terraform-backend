import { DefaultStackSynthesizer, StackProps } from 'aws-cdk-lib';
import { MD5 } from 'object-hash';

/**
 * AWS Account and Region to deploy the stack
 */
export const stackEnv = {
  account: process.env.AWS_ACCOUNT || '000000000000',
  region: process.env.AWS_REGION || 'us-east-1',
} as const;

/**
 * Tags to apply to the stack and resources
 */
// TODO: modify tags to your own needs
export const stackTags = {
  Project: 'aws-cdk-terraform-backend', // this is used as stack name
  Terrform: 'true',
  CDK: 'true',
} as const;

/**
 * Stack properties
 */
// TODO: modify stack properties to your own needs
export const stackProps: StackProps = {
  env: stackEnv,
  tags: stackTags,
  terminationProtection: false,
  analyticsReporting: false,
  stackName: stackTags.Project,
  description: 'S3 Buckets and DynamoDB Tables for Terraform Backend',
  synthesizer: new DefaultStackSynthesizer({ generateBootstrapVersionRule: false }),
} as const;

/**
 * Get a valid and unique name using `basename`, `stackTags` and `stackEnv`
 * for s3 buckets and dynamodb tables
 */
function generateName(baseName: string, length: number): string {
  if (!(baseName.length > 3 && !baseName.startsWith('-') && !baseName.endsWith('-')))
    throw Error('invalid name');
  const hashBase = baseName + stackTags.Project + stackEnv.account + stackEnv.region;
  return `${baseName}-${MD5(hashBase)}`.toLowerCase().trim().substring(0, length);
}

/**
 * Application configuration
 */
export const appConfig = {
  /**
   * list of DynamoDB table names
   * from `DYNAMODB_TABLE_NAMES` environment variable (_comma separated list of names_)
   *
   * **NOTE**: to generate unique names, use `generateName` function
   * @example DYNAMODB_TABLE_NAMES="terraform-state-lock-1,terraform-state-lock-2"
   */
  tableNames: process.env.DYNAMODB_TABLE_NAMES?.split(',').map((n) => n.trim()) || [
    generateName('terraform-state-lock', 30),
  ],
  /**
   * list of S3 bucket names
   * from `S3_BUCKET_NAMES` environment variable (_comma separated list of names_)
   *
   * **NOTE**: to generate unique names, use `generateName` function
   * @example S3_BUCKET_NAMES="globally-unique-bucket-name-1,globally-unique-bucket-name-2"
   */
  bucketNames: process.env.S3_BUCKET_NAMES?.split(',').map((n) => n.trim()) || [
    generateName('terraform-state', 63),
  ],
};
