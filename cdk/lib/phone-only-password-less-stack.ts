import { CfnUserPool } from '@aws-cdk/aws-cognito';
import { Duration } from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';

export class PhoneOnlyPasswordLessStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const PRE_SIGNUP = new lambda.Function(
			this,
			'passwordless-phone-number-pre-sign-up-function',
			{
				functionName: 'passwordless-phone-number-pre-sign-up-function',
				runtime: lambda.Runtime.NODEJS_14_X,
				code: lambda.Code.fromAsset('../lambda-functions'),
				handler: 'pre-sign-up.handler',
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
			'passwordless-phone-number-define-auth-challenge-function1',
			{
				functionName: 'passwordless-phone-number-define-auth-challenge1',
				runtime: lambda.Runtime.NODEJS_14_X,
				code: lambda.Code.fromAsset('../lambda-functions'),
				handler: 'define-auth-challenge.handler',
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
			'passwordless-phone-number-create-auth-challenge-function1',
			{
				functionName: 'passwordless-phone-number-create-auth-challenge1',
				runtime: lambda.Runtime.NODEJS_14_X,
				code: lambda.Code.fromAsset('../lambda-functions'),
				handler: 'create-auth-challenge.handler',
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
			'passwordless-phone-number-verify-auth-challenge-function1',
			{
				functionName: 'passwordless-phone-number-verify-auth-challenge1',
				runtime: lambda.Runtime.NODEJS_14_X,
				code: lambda.Code.fromAsset('../lambda-functions'),
				handler: 'verify-auth-challenge-response.handler',
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
			'passwordless-phone-number-userpool',
			{
				userPoolName: 'passwordless-phone-number-userpool',
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
			'passwordless-phone-number-userpool-app-client',
			{
				userPool: PHONE_ONLY_PASSWORD_LESS_USER_POOL,
				generateSecret: false,
				preventUserExistenceErrors: true,
				userPoolClientName: 'passwordless-phone-number-userpool-app-client',
				authFlows: {
					custom: true,
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
		cfnUserPool.tags.setTag('project', 'passwordless-phone-number-userpool');
	}
}
