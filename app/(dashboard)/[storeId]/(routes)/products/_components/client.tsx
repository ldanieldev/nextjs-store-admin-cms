'use client';

import ApiList from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { ProductColumn, columns } from './columns';

type props = {
  data: ProductColumn[];
};

export default function ProductClient({ data }: props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Product (${data.length})`}
          description='Manage products for your store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey='name' />

      <Heading title='API' description='API calls for Products' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  );
}
