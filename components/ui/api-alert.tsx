'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Copy, Server } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './button';

type props = {
  title: string;
  description: string;
  variant: 'public' | 'admin';
};

const textMap: Record<props['variant'], string> = {
  public: 'Public',
  admin: 'Admin'
};

const variantMap: Record<props['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive'
};

const onCopy = (description: string) => {
  navigator.clipboard.writeText(description);
  toast.info('API Route copied to the clipboard.');
};

export default function ApiAlert({
  title,
  description,
  variant = 'public'
}: props) {
  return (
    <Alert>
      <Server className='h-4 w-4' />
      <AlertTitle className='flex items-center gap-x-2'>
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className='mt-4 flex items-center justify-between'>
        <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
          {description}
        </code>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onCopy(description)}
        >
          <Copy className='h-4 w-4' />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
