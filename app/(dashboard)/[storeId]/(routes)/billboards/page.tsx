import BillboardClient from '@/app/(dashboard)/[storeId]/(routes)/billboards/_components/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { BillboardColumn } from './_components/columns';

type props = { params: { storeId: string } };

const BillBoardsPage: React.FC<props> = async ({ params }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, 'MMMM do, yyyy')
    })
  );

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};
export default BillBoardsPage;
