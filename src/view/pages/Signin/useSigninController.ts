import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { SigninParams } from "@/services/authService/signin";
import { SigninParams, SigninWithGoogleParams } from "@/services/authService/signin";
import { authService } from "@/services/authService";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from 'react-hot-toast';
import { CredentialResponse } from "@react-oauth/google";

const schema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email('Please inform a valid email'),
  password: z.string()
    .min(8, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function useSigninController() {
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

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);

      signin(accessToken);
    } catch {
      toast.error('Invalid credentials', {position: "bottom-center"})
      console.log("error on signin");
      
    }
  });

  return { handleSubmit, register, errors, isPending };
  const handleSignInWithGoogleResponse = async (response: CredentialResponse) => {
    try {
      console.log(response);
      if (!response?.credential) {
        throw new Error("");
      }
      const { accessToken } = await mutateAsyncGoogle({token : response.credential ?? ""})
      signin(accessToken);
    } catch {
      toast.error(t('errors.signinGoogleFailed'), {position: "bottom-center"})
    }
  };

  return { handleSubmit, register, handleSignInWithGoogleResponse, errors, isPending, isPendingGoogle };

}

