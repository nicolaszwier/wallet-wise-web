import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

import { localStorageKeys } from "../config/localStorageKeys";
import { User } from "../models/User";
import { usersService } from "@/services/usersService";
import toast from "react-hot-toast";

interface AuthContextValue {
  signedIn: boolean;
  user: User | undefined;
  signin(accessToken: string): void;
  signout(): void;
}

export const AuthContext = createContext({} as AuthContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    const storedAccessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

    return !!storedAccessToken;
  });

  const { isError, isFetching, isSuccess, data } = useQuery({
    queryKey: ['users', 'my-profile'],
    queryFn: () => usersService.myProfile(),
    enabled: signedIn,
    staleTime: Infinity,
  });

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken);
    setSignedIn(true);
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(localStorageKeys.SELECTED_PLANNING);
    setSignedIn(false);
  }, []);

  useEffect(() => {
    if (isError) {
      signout();
      toast.error('Authentication error. Please signin again.');
    }
  }, [isError, signout]);

  return (
    <AuthContext.Provider
      value={{
        signedIn: isSuccess && signedIn,
        user: data,
        signin,
        signout
      }}
    >

      {isFetching && (
        <div>loading screen</div>
      )}

      {!isFetching && children}
    </AuthContext.Provider>
  );
}
