import { User } from "@/app/models/User";
import { httpClient } from "../httpClient";

type UserProfileResponse = User;

export async function myProfile() {
  const { data } = await httpClient.get<UserProfileResponse>('/users/my-profile');

  return data;
}
