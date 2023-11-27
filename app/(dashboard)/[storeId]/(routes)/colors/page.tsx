import ColorClient from '@/app/(dashboard)/[storeId]/(routes)/colors/_components/client';
import prismadb from '@/lib/prismadb';
import { format } from 'date-fns';
import { ColorColumn } from './_components/columns';

type props = { params: { storeId: string } };

const ColorsPage: React.FC<props> = async ({ params }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM do, yyyy')
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};
export default ColorsPage;
