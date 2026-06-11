import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { ChangePasswordParams } from "@/services/authService/changePassword";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useTranslation } from "react-i18next";

const schema = z.object({
  currentPassword: z.string().min(1, 'formsValidation.passwordRequired'),
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

export function useChangePasswordController() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit: hookFormSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ChangePasswordParams) => {
      return authService.changePassword(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success(t('changePassword.success'), { position: "bottom-center" });
      reset();
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('changePassword.error');

      toast.error(message, { position: "bottom-center" });
    }
  });

  return {
    handleSubmit,
    register,
    errors,
    isPending,
  };
}
