import { httpClient } from "../httpClient";

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message: string;
}

export async function changePassword(params: ChangePasswordParams) {
  const { data } = await httpClient.patch<ChangePasswordResponse>('/auth/change-password', params);

  return data;
}
