import OrderClient from '@/app/(dashboard)/[storeId]/(routes)/orders/_components/client';
import prismadb from '@/lib/prismadb';
import { priceFormatter } from '@/lib/utils';
import { format } from 'date-fns';
import { OrderColumn } from './_components/columns';

type props = { params: { storeId: string } };

const OrdersPage: React.FC<props> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems.map((item) => item.product.name).join(', '),
    totalPrice: priceFormatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    createdAt: format(order.createdAt, 'MMMM do, yyyy')
  }));

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
