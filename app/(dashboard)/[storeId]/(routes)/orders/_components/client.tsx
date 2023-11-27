'use client';

import DataTable from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './columns';

type props = {
  data: OrderColumn[];
};

export default function OrderClient({ data }: props) {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description='Manage orders for your store'
      />
      <Separator />

      <DataTable columns={columns} data={data} searchKey='products' />
    </>
  );
}
