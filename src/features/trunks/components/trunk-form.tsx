'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trunk } from '@/constants/data';

// Define Partner type for the dropdown
type Partner = {
  id: number;
  partner_name: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Trunk name must be at least 2 characters.'
  }),
  partnerId: z.string().min(1, {
    message: 'Please select a partner'
  }),
  description: z.string().optional()
});

export default function TrunkForm({
  initialData,
  pageTitle
}: {
  initialData: Trunk | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);

  // Fetch partners for dropdown
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partner');
        if (!res.ok) throw new Error('Failed to fetch partners');
        const data = await res.json();
        setPartners(data.partners || []);
      } catch (error) {
        console.error('Error fetching partners:', error);
        toast.error('Failed to load partners');
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchPartners();
  }, []);

  const defaultValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    partnerId: initialData?.partnerId ? String(initialData.partnerId) : ''
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
      const url = initialData ? `/api/trunk/${initialData.id}` : '/api/trunk';
      const successMessage = initialData
        ? 'Trunk updated successfully!'
        : 'Trunk created successfully!';
      const errorMessage = initialData
        ? 'Failed to update trunk'
        : 'Failed to create trunk';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          id: initialData?.id,
          partnerId: parseInt(values.partnerId)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || errorMessage);
      } else {
        toast.success(successMessage);

        if (!initialData) {
          form.reset();
        }

        // redirect to /dashboard/trunk/
        router.push('/dashboard/trunk');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred');
      console.error(error);
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
                    <FormLabel>Trunk Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter trunk name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='partnerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingPartners}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select partner' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='max-h-60 overflow-y-auto'>
                        {partners.map((partner) => (
                          <SelectItem
                            key={partner.id}
                            value={partner.id.toString()}
                          >
                            {partner.partner_name}
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
                      placeholder='Enter description'
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
                  ? 'Update Trunk'
                  : 'Add Trunk'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
