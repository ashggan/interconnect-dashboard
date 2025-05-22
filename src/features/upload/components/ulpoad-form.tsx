'use client';

import { FileUploader } from '@/components/file-uploader';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { FileUpload } from '@/constants/data';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPTED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Updated schema without path field
const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters.'
    })
    .max(100, {
      message: 'Name must be less than 100 characters.'
    }),
  file: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 1,
      'A single file is required.'
    )
    .refine((files) => !files || ACCEPTED_FILE_TYPES.includes(files[0]?.type), {
      message: 'Only .csv, .xls, or .xlsx files are accepted.'
    })
});

export default function UploadForm({
  initialData,
  pageTitle
}: {
  initialData: FileUpload | null;
  pageTitle: string;
}) {
  const [userId, setUserId] = useState<string>('');
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: session.user.email })
          });

          if (response.ok) {
            const data = await response.json();
            setUserId(String(data.userId));
          } else {
            throw new Error('Failed to get user ID');
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
          toast.error('Failed to get user information');
        }
      }
    };

    fetchUserId();
  }, [session]);

  // Updated default values without path
  const defaultValues: z.infer<typeof formSchema> = {
    name: initialData?.name || '',
    file: null
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/upload/${initialData.id}` : '/api/upload';
      const successMessage = initialData
        ? 'File updated successfully!'
        : 'File uploaded successfully!';
      const errorMessage = initialData
        ? 'Failed to update file'
        : 'Failed to upload file';

      if (!userId) {
        toast.error('User authentication required');
        return;
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('userId', userId);

      if (values.file && values.file.length > 0) {
        formData.append('file', values.file[0]);
      }

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || errorMessage);
      }

      toast.success(successMessage);

      if (!initialData) {
        form.reset();
      }

      router.push('/dashboard/upload');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter a descriptive name for this file'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <FormField
                control={form.control}
                name='file'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={100 * 1024 * 1024} // 100MB max
                        accept={{
                          'text/csv': ['.csv'],
                          'application/vnd.ms-excel': ['.xls'],
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            ['.xlsx']
                        }}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Show upload progress or status */}
            {isLoading && (
              <div className='flex items-center space-x-2 text-sm text-gray-600'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent' />
                <span>Uploading ...</span>
              </div>
            )}

            <Button
              type='submit'
              disabled={isLoading || !userId}
              className='w-full'
            >
              {isLoading ? 'Uploading...' : 'Upload File'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
