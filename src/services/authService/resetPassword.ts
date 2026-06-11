import { httpClient } from "../httpClient";

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export async function resetPassword(params: ResetPasswordParams) {
  const { data } = await httpClient.post<ResetPasswordResponse>('/auth/reset-password', params);

  return data;
}
