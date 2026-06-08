import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { SigninParams, SigninWithAppleParams, SigninWithGoogleParams } from "@/services/authService/signin";
import { authService } from "@/services/authService";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from 'react-hot-toast';
import { CredentialResponse } from "@react-oauth/google";
import { useTranslation } from "react-i18next";

const schema = z.object({
  email: z.string()
    .min(1, 'formsValidation.emailRequired')
    .email('formsValidation.emailValid'),
  password: z.string()
    .min(8, 'formsValidation.passwordRequired'),
});

type FormData = z.infer<typeof schema>;

export function useSigninController() {
  const {t} = useTranslation()
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending, } = useMutation({
    mutationFn: async (data: SigninParams) => {
      return authService.signin(data);
    },
  });

  const { mutateAsync: mutateAsyncGoogle, isPending: isPendingGoogle, } = useMutation({
    mutationFn: async (data: SigninWithGoogleParams) => {
      return authService.signinWithGoogle(data);
    },
  });

  const { mutateAsync: mutateAsyncApple, isPending: isPendingApple, } = useMutation({
    mutationFn: async (data: SigninWithAppleParams) => {
      return authService.signinWithApple(data);
    },
  });

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);
      signin(accessToken);
    } catch {
      toast.error(t('formsValidation.invalidCredentials'), {position: "bottom-center"})
    }
  });

  const handleSignInWithGoogleResponse = async (response: CredentialResponse) => {
    try {
      console.log(response);
      if (!response?.credential) {
        throw new Error("");
      }
      const { accessToken } = await mutateAsyncGoogle({token : response.credential ?? ""})
      signin(accessToken);
    } catch {
      toast.error(t('formsValidation.signinGoogleFailed'), {position: "bottom-center"})
    }
  };

  const handleSignInWithApple = async () => {
    try {
      const response = await AppleID.auth.signIn();

      if (!response?.authorization?.id_token) {
        throw new Error("");
      }

      const params: SigninWithAppleParams = {
        token: response.authorization.id_token,
      };

      if (response.user) {
        params.user = {
          email: response.user.email,
          name: {
            firstName: response.user.name?.firstName,
            lastName: response.user.name?.lastName,
          },
        };
      }

      const { accessToken } = await mutateAsyncApple(params);
      signin(accessToken);
    } catch {
      toast.error(t('formsValidation.signinAppleFailed'), { position: "bottom-center" });
    }
  };

  return {
    handleSubmit,
    register,
    handleSignInWithGoogleResponse,
    handleSignInWithApple,
    errors,
    isPending,
    isPendingGoogle,
    isPendingApple,
  };

}

