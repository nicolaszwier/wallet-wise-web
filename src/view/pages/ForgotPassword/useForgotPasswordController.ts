import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authService } from "@/services/authService";
import { ForgotPasswordParams } from "@/services/authService/forgotPassword";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useTranslation } from "react-i18next";

const schema = z.object({
  email: z.string()
    .min(1, 'formsValidation.emailRequired')
    .email('formsValidation.emailValid'),
});

type FormData = z.infer<typeof schema>;

export function useForgotPasswordController() {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordParams) => {
      return authService.forgotPassword(data);
    },
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await mutateAsync(data);
      setIsSubmitted(true);
    } catch (error) {
      const message = axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : t('forgotPassword.error');

      toast.error(message, { position: "bottom-center" });
    }
  });

  return {
    handleSubmit,
    register,
    errors,
    isPending,
    isSubmitted,
  };
}
