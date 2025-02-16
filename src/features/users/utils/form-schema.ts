import { Role } from 'types';
import * as z from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'User Name must be at least 3 characters' }),
    email: z.string().email({ message: 'Email must be a valid email address' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    role: z.nativeEnum(Role),
    isBlocked: z.boolean()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type UserFormValues = z.infer<typeof formSchema>;
