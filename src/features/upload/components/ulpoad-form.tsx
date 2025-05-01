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
import { getUSerId } from '@/lib/utils';
import { FileUpload } from '@/constants/data';
import { useEffect, useState } from 'react';

const ACCEPTED_FILE_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'name must be at least 3 characters.'
    })
    .max(48, {
      message: 'Description must be less than 48 characters.'
    }),
  path: z.string(),
  file: z
    .any()
    .refine((files) => files?.length === 1, 'A single file is required.')
    .refine((files) => ACCEPTED_FILE_TYPES.includes(files[0]?.type), {
      message: 'Only .csv, .xls, or .xlsx files are accepted.'
    }),
  userId: z
    .string()
    .min(1, {
      message: 'userId is required.'
    })
    .max(48, {
      message: 'userId must be less than 48 characters.'
    })
    .optional()
    .nullable()
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

  useEffect(() => {
    const fetchUserId = async () => {
      if (session?.user?.email) {
        const id = await getUSerId(session.user.email);
        setUserId(id);
        console.log('userId', id);
      }
    };

    fetchUserId();
  }, [session]);

  const defaultValues: z.infer<typeof formSchema> = {
    name: initialData?.name || '',
    path: initialData?.path || '',
    userId: initialData?.userId ? String(initialData.userId) : '',
    file: initialData?.file || null
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values', values);
    // Add your form submission logic here
  };

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
                    <Input placeholder='Enter File name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='file'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>file</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={4 * 1024 * 1024}
                        accept={{
                          'application/*': ['.xlsx', '.xls', '.csv']
                        }}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button type='submit'>Upload </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
