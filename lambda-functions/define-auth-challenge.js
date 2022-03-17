/*

Lambda function for the Cognito trigger "Define Auth Challenge"

*/

'use strict';

exports.handler = async (event) => {
	console.log('RECEIVED event: ', JSON.stringify(event, null, 2));

	if (
		event.request.session &&
		event.request.session.length &&
		event.request.session.slice(-1)[0].challengeName == 'SRP_A'
	) {
		event.request.session = [];
		event.response.issueTokens = false;
		event.response.failAuthentication = false;
		event.response.challengeName = 'CUSTOM_CHALLENGE';
	}
	// Correct OTP
	else if (
		event.request.session &&
		event.request.session.length &&
		event.request.session.slice(-1)[0].challengeName === 'CUSTOM_CHALLENGE' &&
		event.request.session.slice(-1)[0].challengeResult === true
	) {
		console.log('The user provided the right answer to the challenge');
		event.response.issueTokens = true;
		event.response.failAuthentication = false;
	}
	// After 3 failed challenge responses from user, fail authentication
	else if (
		event.request.session &&
		event.request.session.length >= 3 &&
		event.request.session.slice(-1)[0].challengeResult === false
	) {
		console.log(
			'FAILED Authentication: The user provided a wrong answer 3 times'
		);
		event.response.issueTokens = false;
		event.response.failAuthentication = true;
	}
	// The user did not provide a correct answer yet; present CUSTOM_CHALLENGE again
	else {
		event.response.issueTokens = false;
		event.response.failAuthentication = false;
		event.response.challengeName = 'CUSTOM_CHALLENGE';
	}

	console.log('RETURNED event: ', JSON.stringify(event, null, 2));

	return event;
};
