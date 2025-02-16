'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Role } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { User } from 'types';
import * as z from 'zod';
import { formSchema, UserFormValues } from '../utils/form-schema';
import { createUser } from '@/services/user';

export default function UserForm({
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

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(values: UserFormValues) {
    try {
      const user = await createUser({ ...values });
      console.log('User created:', user);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      {/* <CardContent>
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
            <Button type='submit'>Add User</Button>
          </form>
        </Form>
      </CardContent> */}
    </Card>
  );
}
