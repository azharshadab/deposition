import config from '@config';
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export interface UserPayload {
  sub: string;
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  given_name: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  family_name: string;
  email: string;
}

export interface ErrorInfo {
  name: string;
  code: string;
  message: string;
}

export const awsConfig = config.TranscriptAnalysis.AWSCognitoConfig;

export const userPool = new CognitoUserPool({
  ClientId: awsConfig.ClientId,
  UserPoolId: awsConfig.UserPoolId,
});

export interface GetUserIdResponseData {
  'body-json': {
    body: string;
  };
}

export interface GetUserIdParsedResponse {
  UserId: number;
  FirstName: string;
  LastName: string;
}

export type SignUpInfo = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  acceptedTermsAndConditions: boolean;
};
