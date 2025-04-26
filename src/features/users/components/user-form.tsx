'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import Router from 'next/router';
import { formSchema } from '../utils/form-schema';
import { Role } from '@prisma/client';
import { User } from 'types';
import { Checkbox } from '@radix-ui/react-checkbox';

export default function ParnterForm({
  initialData,
  pageTitle
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const defaultValues = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    confirmPassword: '',
    role: initialData?.role || Role.USER,
    isBlocked: initialData?.isBlocked || false
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/user/${initialData.id}` : '/api/user';
      const successMessage = initialData
        ? 'User updated successfully!'
        : 'User created successfully!';
      const errorMessage = initialData
        ? 'Failed to update user'
        : 'Failed to create user';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...values, id: initialData?.id })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // User email already exists
          toast.error(
            'A User with this email already exists. Please choose a different email.'
          );
        } else {
          toast.error(data.error || errorMessage);
        }
      } else {
        toast.success(successMessage);

        if (!initialData) {
          form.reset();
        }

        // redirect to /dashboard/user/
        Router.push('/dashboard/user');
      }
    } catch (error) {
      // setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submitError && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-500'>
            {submitError}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Password'
                        {...field}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Confirm Password'
                        {...field}
                        type='password'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value as Role}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select Role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.USER}>User </SelectItem>
                        <SelectItem value={Role.ADMIN}>Admin </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isBlocked'
                render={({ field }) => (
                  <FormItem>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className='m-2'
                    />
                    <FormLabel>Block</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>
              {defaultValues ? 'Add User' : 'Update User'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
