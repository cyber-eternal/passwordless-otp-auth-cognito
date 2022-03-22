import * as cdk from '@aws-cdk/core';
import { PhoneOnlyPasswordLessStack } from '../lib/phone-only-password-less-stack';

const app = new cdk.App();
new PhoneOnlyPasswordLessStack(app, 'PhoneOnlyPasswordLessStack', {
	env: { region: 'us-east-1', account: '701768494004' },
});
