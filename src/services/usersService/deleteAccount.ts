import { httpClient } from "../httpClient";

interface DeleteAccountResponse {
  message: string;
}

export async function deleteAccount() {
  const { data } = await httpClient.delete<DeleteAccountResponse>('/users/delete-account');

  return data;
}
