interface AppleAuthInitConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  usePopup: boolean;
}

interface AppleSignInAuthorization {
  id_token: string;
  code: string;
  state?: string;
}

interface AppleSignInUser {
  email: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

interface AppleSignInResponse {
  authorization: AppleSignInAuthorization;
  user?: AppleSignInUser;
}

interface AppleAuth {
  init(config: AppleAuthInitConfig): void;
  signIn(): Promise<AppleSignInResponse>;
}

interface AppleIDGlobal {
  auth: AppleAuth;
}

declare const AppleID: AppleIDGlobal;
