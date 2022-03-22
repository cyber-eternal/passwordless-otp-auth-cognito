import cdk = require('@aws-cdk/core');
import cognito = require('@aws-cdk/aws-cognito');
import { CfnUserPool } from '@aws-cdk/aws-cognito';
import { Duration } from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');

export class PhoneOnlyPasswordLessStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		/* #region  Cognito UserPool & App Client for Main APP */

		const PRE_SIGNUP = new lambda.Function(
			this,
			'phone-only-password-less-pre-sign-up-function',
			{
				functionName: 'phone-only-password-less-pre-sign-up',
				runtime: lambda.Runtime.NODEJS_12_X,
				code: lambda.Code.asset(
					'lib/aws-cognito/phone-only-password-less/pre-signup-lambda'
				), // your function directory
				handler: 'pre-signup-lambda.handler',
				timeout: Duration.seconds(3),
				memorySize: 128,
				initialPolicy: [
					new iam.PolicyStatement({
						actions: ['lambda:*', 'sns:*'],
						resources: ['*'],
					}),
				],
			}
		);

		const DEFINE_AUTH_CHALLENGE = new lambda.Function(
			this,
			'phone-only-password-less-define-auth-challenge-function',
			{
				functionName: 'phone-only-password-less-define-auth-challenge',
				runtime: lambda.Runtime.NODEJS_12_X,
				code: lambda.Code.asset(
					'lib/aws-cognito/phone-only-password-less/define-auth-challenge-lambda'
				), // your function directory
				handler: 'define-auth-challenge-lambda.handler',
				timeout: Duration.seconds(3),
				memorySize: 128,
				initialPolicy: [
					new iam.PolicyStatement({
						actions: ['lambda:*', 'sns:*'],
						resources: ['*'],
					}),
				],
			}
		);

		const CREATE_AUTH_CHALLENGE = new lambda.Function(
			this,
			'phone-only-password-less-create-auth-challenge-function',
			{
				functionName: 'phone-only-password-less-create-auth-challenge',
				runtime: lambda.Runtime.NODEJS_12_X,
				code: lambda.Code.asset(
					'lib/aws-cognito/phone-only-password-less/create-auth-challenge-lambda'
				), // your function directory
				handler: 'create-auth-challenge-lambda.handler',
				timeout: Duration.seconds(3),
				memorySize: 128,
				initialPolicy: [
					new iam.PolicyStatement({
						actions: ['lambda:*', 'sns:*'],
						resources: ['*'],
					}),
				],
			}
		);

		const VERIFY_AUTH_CHALLENGE = new lambda.Function(
			this,
			'phone-only-password-less-verify-auth-challenge-function',
			{
				functionName: 'phone-only-password-less-verify-auth-challenge',
				runtime: lambda.Runtime.NODEJS_12_X,
				code: lambda.Code.asset(
					'lib/aws-cognito/phone-only-password-less/verify-auth-challenge-lambda'
				), // your function directory
				handler: 'verify-auth-challenge-lambda.handler',
				timeout: Duration.seconds(3),
				memorySize: 128,
				initialPolicy: [
					new iam.PolicyStatement({
						actions: ['lambda:*', 'sns:*'],
						resources: ['*'],
					}),
				],
			}
		);

		const PHONE_ONLY_PASSWORD_LESS_USER_POOL = new cognito.UserPool(
			this,
			'phone-only-password-less-userpool',
			{
				userPoolName: 'phone-only-password-less-userpool',
				signInAliases: {
					phone: true,
				},
				standardAttributes: {
					phoneNumber: {
						mutable: true,
						required: true,
					},
				},
				selfSignUpEnabled: true,
				userInvitation: {
					emailBody:
						'[TEST_APP]: Your username is {username} and temporary password is {####}.',
					emailSubject: '[TEST_APP]: Your temporary password',
					smsMessage:
						'[TEST_APP]: Your username is {username} and temporary password is {####}.',
				},
				passwordPolicy: {
					tempPasswordValidity: Duration.days(8),
					minLength: 8,
					requireDigits: false,
					requireLowercase: false,
					requireSymbols: false,
					requireUppercase: false,
				},
				signInCaseSensitive: false,
				lambdaTriggers: {
					preSignUp: PRE_SIGNUP,
					defineAuthChallenge: DEFINE_AUTH_CHALLENGE,
					createAuthChallenge: CREATE_AUTH_CHALLENGE,
					verifyAuthChallengeResponse: VERIFY_AUTH_CHALLENGE,
				},
			}
		);
		const APPCLIENT = new cognito.UserPoolClient(
			this,
			'phone-only-password-less-userpool-app-client',
			{
				userPool: PHONE_ONLY_PASSWORD_LESS_USER_POOL,
				generateSecret: false,
				preventUserExistenceErrors: true,
				userPoolClientName: 'phone-only-password-less-userpool-app-client',
				authFlows: {
					custom: true, // CUST_AUTH_FLOW
					// refreshToken: true,
				},
			}
		);

		const cfnUserPool = PHONE_ONLY_PASSWORD_LESS_USER_POOL.node
			.defaultChild as CfnUserPool;
		cfnUserPool.accountRecoverySetting = {
			recoveryMechanisms: [
				{
					name: 'admin_only',
					priority: 1,
				},
			],
		};
		cfnUserPool.tags.setTag('project', 'phone-only-password-less-userpool');
	}
}
