import { httpClient } from "../httpClient";

export interface ForgotPasswordParams {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export async function forgotPassword(params: ForgotPasswordParams) {
  const { data } = await httpClient.post<ForgotPasswordResponse>('/auth/forgot-password', params);

  return data;
}
