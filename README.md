# aws-cdk-terraform-backend

[![dev](https://github.com/igwtcode/aws-cdk-terraform-backend/actions/workflows/dev.yml/badge.svg)](https://github.com/igwtcode/aws-cdk-terraform-backend/actions/workflows/dev.yml)

This is an `aws-cdk` app in typescript to create S3 buckets and DynamoDB tables for
storing terraform state and lock files.

## environment variables

**required**

```bash
AWS_ACCESS_KEY_ID="<your aws access key id>"
AWS_SECRET_ACCESS_KEY="<your aws secret access key>"
AWS_ACCOUNT="<your aws account id>"
```

_(optional)_

```bash
# default: us-east-1
AWS_REGION="us-east-1"

# default: a generated unique 30 characters name like "terraform-state-lock-xxxxxx..."
DYNAMODB_TABLE_NAMES="terraform-state-lock-1,terraform-state-lock-2, ..."

# default: a generated unique 63 characters name like "terraform-state-xxxxxxxxxxx....."
S3_BUCKET_NAMES="globally-unique-bucket-name-1,globally-unique-bucket-name-2, ..."
```

## usage

> **NOTE:** make sure you have `node` and `npm` installed

```bash
# install dependencies
npm install
```

> see `package.json` for more scripts

```bash
# lint, test, build
npm run build

# lint, test, build, bootstrap, synthesize, deploy
npm run deploy

# lint, test, build, bootstrap, synthesize, destroy
npm run destroy
```

## outputs

to get the stack outputs (_s3 bucket and dynamodb table names_), use either aws management
console or aws cli by running the following command:

> replace `aws-cdk-terraform-backend` with your stack name
>
> replace `us-east-1` with your region
>
> \*stack name is the project tag set here (`src/config.ts` -> `stackTags.Project`)

```bash
aws cloudformation describe-stacks \
--region us-east-1 \
--stack-name aws-cdk-terraform-backend \
--query "Stacks[0].Outputs" \
| grep -E "ExportName|OutputValue"
```

## License

MIT
([see license](https://github.com/igwtcode/aws-cdk-terraform-backend/blob/main/LICENSE))
