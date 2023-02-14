#!/usr/bin/env node
import 'source-map-support/register.js';
import { TerraformBackendStack } from '@src/stack.js';
import { App } from 'aws-cdk-lib';

const app = new App();
new TerraformBackendStack(app);
