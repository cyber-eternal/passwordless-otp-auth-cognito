/*

Lambda function for the Cognito trigger "Pre sign-up"

*/
'use strict';

exports.handler = async (event) => {
	console.log('Received EVENT', JSON.stringify(event, null, 2));

	event.response.autoConfirmUser = true;
	event.response.autoVerifyPhone = true;
	return event;
};
