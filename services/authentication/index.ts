import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import {
  GetUserIdParsedResponse,
  GetUserIdResponseData,
  SignUpInfo,
  UserPayload,
  userPool,
} from './helper';
import { httpService } from '@services/http';
import config from '@config';

class AuthenticationService {
  private getSession(
    email: string,
    password: string,
  ): Promise<CognitoUserSession> {
    const user = new CognitoUser({ Username: email, Pool: userPool });

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authenticationDetails, {
        onSuccess: session => {
          resolve(session);
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  }

  public async signInUser(email: string, password: string): Promise<boolean> {
    try {
      const session = await this.getSession(email, password);
      return session.isValid();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  private getCurrentUserSession(): Promise<CognitoUserSession | null> {
    return new Promise((resolve, reject) => {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) return resolve(null);
      cognitoUser.getSession(
        (err: Error | null, session: CognitoUserSession | null) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(session);
        },
      );
    });
  }

  private getUser(email: string) {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool: userPool,
    });
  }

  public async isUserSignedIn(): Promise<boolean> {
    try {
      const session = await this.getCurrentUserSession();
      return !!session && session.isValid();
    } catch (error) {
      console.error('Error checking user session:', error);
      return false;
    }
  }
  
  public forgotPassword(email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUser(email).forgotPassword({
        onSuccess: data => {
          resolve('Verification code sent successfully.');
        },
        onFailure: err => {
          reject(err);
        },
        inputVerificationCode: data => {
          resolve('Verification code sent to: ' + data);
        },
      });
    });
  }

  public confirmPassword(
    email: string,
    code: string,
    password: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUser(email).confirmPassword(code, password, {
        onSuccess: () => {
          resolve('Password confirmed!');
        },
        onFailure: err => {
          reject(err);
        },
      });
    });
  }

  public signOut() {
    const user = userPool.getCurrentUser();
    if (user) {
      user.signOut();
      window.location.href = '/login';
    } else {
      console.log('No user to sign out.');
    }
  }
  
  public async getJwtToken(): Promise<string | null> {
    const session = await this.getCurrentUserSession();
    return session ? session.getIdToken().getJwtToken() : null;
  }

  public async getUserPayload(): Promise<UserPayload | null> {
    const session = await this.getCurrentUserSession();
    return session ? (session.getIdToken().payload as UserPayload) : null;
  }

  public async getUserId(): Promise<number> {
    const payload = await this.getUserPayload();
    const idToken = await this.getJwtToken();

    const res = await httpService.get<GetUserIdResponseData>(
      config.TranscriptAnalysis.AWSApiGateway.GetUserId,
      {
        useAuthToken: false,
        useUsername: false,
        params: {
          FirstName: 'none',
          LastName: 'none',
          ProcessType: 'login',
          email: 'none',
          username: payload?.['cognito:username'],
          refreshtoken: idToken,
        },
      },
    );

    const [parsedData] = JSON.parse(
      res.data['body-json'].body,
    ) as GetUserIdParsedResponse[];

    return parsedData.UserId;
  }

  private getAttributes(userInfo: SignUpInfo) {
    const attributeList = [];

    const dataFname = { Name: 'given_name', Value: userInfo.first_name };
    const dataLname = { Name: 'family_name', Value: userInfo.last_name };
    const dataEmail = { Name: 'email', Value: userInfo.email };

    const attributeFname = new CognitoUserAttribute(dataFname);
    const attributeLname = new CognitoUserAttribute(dataLname);
    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeFname);
    attributeList.push(attributeLname);
    attributeList.push(attributeEmail);

    return attributeList;
  }

  private async signUpUserCognito(
    userInfo: SignUpInfo,
    attributeList: CognitoUserAttribute[],
  ) {
    return new Promise<ISignUpResult>(async (resolve, reject) => {
      userPool.signUp(
        userInfo.username,
        userInfo.password,
        attributeList,
        [],
        async (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          try {
            if (result) resolve(result!);
            else reject('something went wrong');
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }

  private async signUpUserPersonalDB(userInfo: SignUpInfo) {
    const res = await httpService.get(
      config.TranscriptAnalysis.AWSApiGateway.GetUserId,
      {
        params: {
          username: userInfo.username,
          FirstName: userInfo.first_name,
          LastName: userInfo.last_name,
          ProcessType: 'signup',
          email: userInfo.email,
        },
      },
    );
    console.log(res.data);
  }

  async signUp(userInfo: SignUpInfo) {
    const attributeList = this.getAttributes(userInfo);
    await this.signUpUserCognito(userInfo, attributeList);
    await this.signUpUserPersonalDB(userInfo);
  }
}

export const authenticationService = new AuthenticationService();
