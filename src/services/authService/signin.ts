import { httpClient } from "../httpClient";

export interface SigninParams {
  email: string;
  password: string;
}

export interface SigninWithGoogleParams {
  token: string;
}

export interface SigninWithAppleParams {
  token: string;
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

interface SigninResponse {
  accessToken: string;
}

export async function signin(params: SigninParams) {
  const { data } = await httpClient.post<SigninResponse>('/auth/signin', params);

  return data;
}

export async function signinWithGoogle(params: SigninWithGoogleParams) {
  const { data } = await httpClient.post<SigninResponse>('/auth/google', params);

  return data;
}

export async function signinWithApple(params: SigninWithAppleParams) {
  const { data } = await httpClient.post<SigninResponse>('/auth/apple', params);

  return data;
}
