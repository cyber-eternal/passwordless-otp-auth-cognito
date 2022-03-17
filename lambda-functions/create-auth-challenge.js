/*

Lambda function for the Cognito trigger "Create Auth Challenge"

*/

'use strict';

const crypto = require('crypto');
const AWS = require('aws-sdk');

const sendSMS = (phoneNumber, passCode) => {
	const params = {
		Message: 'Your secret code: ' + passCode,
		PhoneNumber: phoneNumber,
	};

	return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
};

exports.handler = async (event) => {
	console.log('RECEIVED event: ', JSON.stringify(event, null, 2));

	let passCode;
	const phoneNumber = event.request.userAttributes.phone_number;

	// The requests received from the mobile apps can contain "SRP_A"
	if (
		(event.request.session &&
			event.request.session.length &&
			event.request.session.slice(-1)[0].challengeName == 'SRP_A') ||
		event.request.session.length == 0
	) {
		passCode = crypto.randomInt(000000, 999999); // 6 digits passcode generation
		await sendSMS(phoneNumber, passCode);
	} else {
		const previousChallenge = event.request.session.slice(-1)[0];
		passCode = previousChallenge.challengeMetadata.match(/CODE-(\d*)/)[1];
	}

	event.response.publicChallengeParameters = {
		phone: event.request.userAttributes.phone_number,
	};
	event.response.privateChallengeParameters = { passCode };
	event.response.challengeMetadata = `CODE-${passCode}`;

	console.log('RETURNED event: ', JSON.stringify(event, null, 2));

	return event;
};
