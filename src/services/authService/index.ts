import { signin, signinWithGoogle, signinWithApple } from "./signin";
import { signup } from "./signup";

export const authService = {
  signup,
  signin,
  signinWithGoogle,
  signinWithApple,
};
