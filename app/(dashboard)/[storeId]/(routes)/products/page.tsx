import ProductClient from '@/app/(dashboard)/[storeId]/(routes)/products/_components/client';
import prismadb from '@/lib/prismadb';
import { priceFormatter } from '@/lib/utils';
import { format } from 'date-fns';
import { ProductColumn } from './_components/columns';

type props = { params: { storeId: string } };

const ProductsPage: React.FC<props> = async ({ params }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: priceFormatter.format(product.price.toNumber()),
    size: product.size.name,
    category: product.category.name,
    color: product.color.value,
    createdAt: format(product.createdAt, 'MMMM do, yyyy')
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};
export default ProductsPage;
