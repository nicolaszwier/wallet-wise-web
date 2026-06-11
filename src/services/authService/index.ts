import { signin, signinWithGoogle, signinWithApple } from "./signin";
import { signup } from "./signup";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";
import { changePassword } from "./changePassword";

export const authService = {
  signup,
  signin,
  signinWithGoogle,
  signinWithApple,
  forgotPassword,
  resetPassword,
  changePassword,
};
