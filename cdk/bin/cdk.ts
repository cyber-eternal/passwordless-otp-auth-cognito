#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
// import { EmailOnlyPasswordLessStack } from '../lib/aws-cognito/email-only-password-less/email-only-password-less-stack';
import { PhoneOnlyPasswordLessStack } from '../lib/phone-only-password-less-stack';
// import { GoogleInvisbleRechaptchaValidationStack } from '../lib/aws-cognito/google-invisble-rechaptcha-validation/google-invisble-rechaptcha-validation-stack';
// import { TOTPSoftwareTokenMFAStack } from '../lib/aws-cognito/totp-software-token-mfa/totp-software-token-mfa-stack';
// import { EmailPasswordClientSideUserSRPAuthFlowStack } from '../lib/aws-cognito/3-email-password-user-srp-authflow/email-password-client-side-user-srp-authflow-stack';
// import { PhonePasswordClientSideUserSRPAuthFlowStack } from '../lib/aws-cognito/4-phone-password-user-srp-authflow/phone-password-user-srp-authflow-stack';

const app = new cdk.App();
// new EmailOnlyPasswordLessStack(app, 'EmailOnlyPasswordLessStack', { env: { region: 'us-east-1', account: 'AWS-ACCOUNT-NO' } });
new PhoneOnlyPasswordLessStack(app, 'PhoneOnlyPasswordLessStack', {
	env: { region: 'us-east-1', account: 'cybereternal' },
});
// new GoogleInvisbleRechaptchaValidationStack(app, 'GoogleInvisbleRechaptchaValidationStack', { env: { region: 'us-east-1', account: 'AWS-ACCOUNT-NO' } });
// new TOTPSoftwareTokenMFAStack(app, 'TOTPSoftwareTokenMFAStack', { env: { region: 'us-east-1', account: 'AWS-ACCOUNT-NO' } });

// new EmailPasswordClientSideUserSRPAuthFlowStack(app, 'EmailPasswordClientSideUserSRPAuthFlowStack', { env: { region: 'us-east-1', account: 'AWS-ACCOUNT-NO' } });
// new PhonePasswordClientSideUserSRPAuthFlowStack(app, 'PhonePasswordClientSideUserSRPAuthFlowStack', { env: { region: 'us-east-1', account: 'AWS-ACCOUNT-NO' } });
