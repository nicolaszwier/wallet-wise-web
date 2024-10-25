import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from 'react-hot-toast';
import { SignupParams } from "@/services/authService/signup";

const schema = z.object({
   name: z.string()
    .min(1, "name is required"),
  email: z.string()
    .min(1, "Email is required")
    .email('Please inform a valid email'),
  password: z.string()
    .min(8, 'Password should be at least 8 characters long')
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password should have at least one uppercase character',
    })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password should have at least one lowercase character',
    })
    .refine((password) => /[0-9]/.test(password), { message: 'Password should have at least one number' })
    .refine((password) => /[!@#$%^&*.]/.test(password), {
      message: 'Password should have at least one special character',
    }),
  passwordConfirmation: z.string().min(8, 'Password confirmation is required')
})
.refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
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

