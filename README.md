# Passwordless Authentication with OTP(SMS) using AWS Cognito

## Custom authentication challenge Lambda triggers diagram

![Lambda Triggers Diagram](https://docs.aws.amazon.com/cognito/latest/developerguide/images/lambda-challenges.png)

In the `lambda-functions` folder were provided simple code examples of the implementation of the lambda functions, with corresponding tiger names, that can be added to the AWS Cognito as triggers to implement the passwordless authentication with phone number using SNS service to send the passcode by SMS.

## Create Auth challenge Lambda trigger parameters

```json
{
    "request": {
        "userAttributes": {
            "string": "string",
            . . .
        },
        "challengeName": "string",
        "session": [
            ChallengeResult,
            . . .
        ],
        "clientMetadata": {
            "string": "string",
            . . .
        },
        "userNotFound": boolean
    },
    "response": {
        "publicChallengeParameters": {
            "string": "string",
            . . .
        },
        "privateChallengeParameters": {
            "string": "string",
            . . .
        },
        "challengeMetadata": "string"
    }
}
```

Find more info [here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-create-auth-challenge.html#cognito-user-pools-lambda-trigger-syntax-create-auth-challenge)

## Define Auth challenge Lambda trigger parameters

```json
{
    "request": {
        "userAttributes": {
            "string": "string",
                . . .
        },
        "session": [
            ChallengeResult,
            . . .
        ],
        "clientMetadata": {
            "string": "string",
            . . .
        },
        "userNotFound": boolean
    },
    "response": {
        "challengeName": "string",
        "issueTokens": boolean,
        "failAuthentication": boolean
}
```

Find more info [here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html)

## Verify Auth challenge Lambda trigger parameters

```json
{
    "request": {
        "userAttributes": {
            "string": "string",
            . . .
        },
        "privateChallengeParameters": {
            "string": "string",
            . . .
        },
        "challengeAnswer": {
            "string": "string",
            . . .
        },
        "clientMetadata": {
            "string": "string",
            . . .
        },
        "userNotFound": boolean
    },
    "response": {
        "answerCorrect": boolean
    }
}
```

Find more info [here](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-define-auth-challenge.html)

### Useful recurses

[AWS Doc](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-challenge.html)
