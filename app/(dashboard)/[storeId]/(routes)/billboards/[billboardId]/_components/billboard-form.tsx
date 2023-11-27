'use client';

import AlertModel from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type props = {
  initialData: Billboard | null;
};

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
});

type formValues = z.infer<typeof formSchema>;

export default function BillboardForm({ initialData }: props) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard';
  const toastMsg = 'Billboard ' + (initialData ? 'updated.' : 'created.');
  const action = initialData ? 'Save Changes' : 'Create';

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`/api/${params.storeId}/billboards`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success(toastMsg);
    } catch (error) {
      toast.error('Something went wrong.Please try again later.t');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await fetch(`/api/${params.storeId}/billboards/${params.billboardId}`, {
        method: 'DELETE'
      });

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
    } catch (error) {
      toast.error(
        'Make sure you have removed all categories using this billboard.'
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModel
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>BackgroundImage</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Billboard label'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
