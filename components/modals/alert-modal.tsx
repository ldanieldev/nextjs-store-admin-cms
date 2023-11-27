'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useEffect, useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading
}: Props) {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!isMounted) return null;

  return (
    <Modal
      title='Are you sure?'
      description='This action cannot be undone.'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
        <Button disabled={loading} onClick={onClose} variant='outline'>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} variant='destructive'>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
