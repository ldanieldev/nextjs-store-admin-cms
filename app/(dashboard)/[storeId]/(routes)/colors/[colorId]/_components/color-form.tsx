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
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

type props = {
  initialData: Color | null;
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be a valid hex code'
  })
});

type formValues = z.infer<typeof formSchema>;

export default function ColorForm({ initialData }: props) {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Color' : 'Create Color';
  const description = initialData ? 'Edit a color' : 'Add a new color';
  const toastMsg = 'Color ' + (initialData ? 'updated.' : 'created.');
  const action = initialData ? 'Save Changes' : 'Create';

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (data: formValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await fetch(`/api/${params.storeId}/colors/${params.colorId}`, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
      } else {
        await fetch(`/api/${params.storeId}/colors`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMsg);
    } catch (error) {
      toast.error('Something went wrong.Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await fetch(`/api/${params.storeId}/colors/${params.colorId}`, {
        method: 'DELETE'
      });

      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success('Color deleted.');
    } catch (error) {
      toast.error(
        'Make sure you have removed all products using this color first.'
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
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder='Color name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={loading}
                        placeholder='Color value'
                        {...field}
                      />
                      <div
                        className='border p-4 rounded-full'
                        style={{ backgroundColor: field.value }}
                      ></div>
                    </div>
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
