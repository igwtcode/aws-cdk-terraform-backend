#!/usr/bin/env node
import { TerraformBackendStack } from '@src/stack';
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';

const app = new App();
new TerraformBackendStack(app);
