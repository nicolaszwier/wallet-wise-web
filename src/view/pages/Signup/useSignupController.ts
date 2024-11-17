import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from 'react-hot-toast';
import { SignupParams } from "@/services/authService/signup";
import { CredentialResponse } from "@react-oauth/google";

const schema = z.object({
   name: z.string()
    .min(1, 'errors.nameRequired'),
  email: z.string()
    .min(1, 'errors.emailRequired')
    .email('errors.emailValid'),
  password: z.string()
    .min(8, 'errors.passwordLength')
    .refine((password) => /[A-Z]/.test(password), {
      message: 'errors.passwordUppercase',
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'errors.passwordLowercase',
    })
    .refine((password) => /[0-9]/.test(password), { message: 'errors.passwordNumber' })
    .refine((password) => /[!@#$%^&*.]/.test(password), {
      message: 'errors.passwordSpecialChar',
    }),
  passwordConfirmation: z.string().min(8, 'errors.passwordConfirmation')
})
.refine((data) => data.password === data.passwordConfirmation, {
  message: 'errors.passwordsDontMatch',
  path: ['passwordConfirmation'],
});;

type FormData = z.infer<typeof schema>;

export function useSignupController() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async (data: SignupParams) => {
      return authService.signup(data);
    },
  });

  const { signin } = useAuth();

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      const { accessToken } = await mutateAsync(data);

      signin(accessToken);
    } catch {      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any)?.response?.data.message || 'An error occured while creating your account', {position: "bottom-center"})
    }
  });

  return { handleSubmit, register, errors, isPending };

}

