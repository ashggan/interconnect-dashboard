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
import { Textarea } from '@/components/ui/textarea';
import { Partner } from '@/constants/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import countries from '@/constants/countries.json';
import { toast } from 'sonner';
import Router from 'next/router';

const formSchema = z.object({
  partner_name: z.string().min(2, {
    message: 'Partner name name must be at least 2 characters.'
  }),
  currency: z.string(),
  country: z.string(),

  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

export default function ParnterForm({
  initialData,
  pageTitle
}: {
  initialData: Partner | null;
  pageTitle: string;
}) {
  const defaultValues = {
    partner_name: initialData?.partner_name || '',
    description: initialData?.description || '',
    currency: initialData?.currency?.toString() || '',
    country: initialData?.country || ''
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
      const url = initialData
        ? `/api/partner/${initialData.id}`
        : '/api/partner';
      const successMessage = initialData
        ? 'Partner updated successfully!'
        : 'Partner created successfully!';
      const errorMessage = initialData
        ? 'Failed to update partner'
        : 'Failed to create partner';

      const res = await fetch(
        `https://interconnect-dashboard.vercel.app${url}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...values, id: initialData?.id })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          // Partner name already exists
          toast.error(
            'A partner with this name already exists. Please choose a different name.'
          );
        } else {
          toast.error(data.error || errorMessage);
        }
      } else {
        toast.success(successMessage);

        if (!initialData) {
          form.reset();
        }

        // redirect to /dashboard/partner/
        Router.push('/dashboard/partners');
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
                name='partner_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter partner name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='currency'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select currency' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-60'>
                        <SelectItem value='USD'>USD</SelectItem>
                        <SelectItem value='EUR'>EUR</SelectItem>
                        <SelectItem value='INR'>INR</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select country' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-60 overflow-y-auto'>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter  description'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting...'
                : initialData
                  ? 'Edit Partner'
                  : 'Add Partner'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
