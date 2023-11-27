import prismadb from '@/lib/prismadb';
import ProductForm, { ProductFormValues } from './_components/product-form';

const ProductPage = async ({
  params
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: { id: params.productId },
    include: {
      images: true
    }
  });

  let formattedProduct = product
    ? {
        ...product,
        price: parseFloat(product?.price.toString())
      }
    : null;

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId }
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId }
  });

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId }
  });

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-8'>
        <ProductForm
          initialData={formattedProduct}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};
export default ProductPage;
