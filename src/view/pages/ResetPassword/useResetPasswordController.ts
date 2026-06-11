import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "@/services/authService";
import { ResetPasswordParams } from "@/services/authService/resetPassword";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useTranslation } from "react-i18next";

const schema = z.object({
  newPassword: z.string()
    .min(8, 'formsValidation.passwordLength')
    .refine((password) => /[A-Z]/.test(password), {
      message: 'formsValidation.passwordUppercase',
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'formsValidation.passwordLowercase',
    })
    .refine((password) => /[0-9]/.test(password), { message: 'formsValidation.passwordNumber' })
    .refine((password) => /[!@#$%^&*.]/.test(password), {
      message: 'formsValidation.passwordSpecialChar',
    }),
  passwordConfirmation: z.string().min(8, 'formsValidation.passwordConfirmation'),
})
.refine((data) => data.newPassword === data.passwordConfirmation, {
  message: 'formsValidation.passwordsDontMatch',
  path: ['passwordConfirmation'],
});

type FormData = z.infer<typeof schema>;

export function useResetPasswordController() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordParams) => {
      return authService.resetPassword(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    if (!token) {
      return;
    }

    try {
      await mutateAsync({ token, newPassword: data.newPassword });
      toast.success(t('resetPassword.success'), { position: "bottom-center" });
      navigate('/signin');
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('resetPassword.error');

      toast.error(message, { position: "bottom-center" });
    }
  });

  return {
    handleSubmit,
    register,
    errors,
    isPending,
    token,
  };
}
