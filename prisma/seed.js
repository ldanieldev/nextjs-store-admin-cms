const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SEED_USER_ID = process.env.SEED_USER_ID;
const SEED_STORE_ID = process.env.SEED_STORE_ID;

if (!SEED_USER_ID) {
  console.error('SEED_USER_ID is required. Run: SEED_USER_ID=user_xxx npm run db:seed');
  process.exit(1);
}

const CDN = 'https://res.cloudinary.com/demo/image/upload';

const billboards = [
  {
    key: 'seasonal',
    label: 'Explore Our Seasonal Collection',
    imageUrl: `${CDN}/samples/landscapes/beach-boat.jpg`,
  },
  {
    key: 'anywhere',
    label: 'For Anywhere and Everywhere',
    imageUrl: `${CDN}/samples/landscapes/nature-mountains.jpg`,
  },
  {
    key: 'step-into-style',
    label: 'Step Into Style',
    imageUrl: `${CDN}/samples/landscapes/architecture-signs.jpg`,
  },
];

const categories = [
  { name: 'Sandals', billboardKey: 'seasonal' },
  { name: 'Sneakers', billboardKey: 'anywhere' },
  { name: 'Dress Shoes', billboardKey: 'step-into-style' },
];

const sizes = [
  { name: 'Small', value: 'S' },
  { name: 'Medium', value: 'M' },
  { name: 'Large', value: 'L' },
];

const colors = [
  { name: 'Brown', value: '#8B4513' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Purple', value: '#7E22CE' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Yellow', value: '#FACC15' },
];

const SHOE_IMG = `${CDN}/samples/ecommerce/shoes.png`;
const SHOE_2 = `${CDN}/shoes.jpg`;
const SNEAKERS_IMG = `${CDN}/sneakers.jpg`;
const ACCESSORY_IMG = `${CDN}/samples/ecommerce/accessories-bag.jpg`;
const LEATHER_IMG = `${CDN}/samples/ecommerce/leather-bag-gray.jpg`;
const ANALOG_IMG = `${CDN}/samples/ecommerce/analog-classic.jpg`;

const products = [
  // Sandals
  { name: 'Coastal Breeze',  category: 'Sandals',     price: '29.99', size: 'Small',  color: 'Pink',   isFeatured: true,  images: [SHOE_IMG, ACCESSORY_IMG] },
  { name: 'Breeze Walk',     category: 'Sandals',     price: '34.99', size: 'Medium', color: 'Blue',   isFeatured: true,  images: [SHOE_IMG, LEATHER_IMG] },
  { name: 'Comfy Strides',   category: 'Sandals',     price: '29.99', size: 'Large',  color: 'White',  isFeatured: true,  images: [SHOE_IMG] },
  // Sneakers
  { name: 'QuantumSole X',   category: 'Sneakers',    price: '159.99', size: 'Medium', color: 'Red',    isFeatured: true,  images: [SNEAKERS_IMG, SHOE_2] },
  { name: 'VaporGlide Elite',category: 'Sneakers',    price: '109.99', size: 'Large',  color: 'White',  isFeatured: false, images: [SNEAKERS_IMG] },
  { name: 'Nebula',          category: 'Sneakers',    price: '39.99',  size: 'Medium', color: 'Black',  isFeatured: true,  images: [SNEAKERS_IMG, SHOE_2] },
  { name: 'Aero Sprint',     category: 'Sneakers',    price: '84.99',  size: 'Large',  color: 'Blue',   isFeatured: true,  images: [SNEAKERS_IMG] },
  { name: 'Street Flex 4',   category: 'Sneakers',    price: '54.99',  size: 'Medium', color: 'Black',  isFeatured: false, images: [SHOE_2, SNEAKERS_IMG] },
  // Dress Shoes
  { name: 'Karley Wing Tip', category: 'Dress Shoes', price: '89.99',  size: 'Medium', color: 'Brown',  isFeatured: true,  images: [SHOE_IMG, ANALOG_IMG] },
  { name: 'Kali Oxfords',    category: 'Dress Shoes', price: '69.99',  size: 'Large',  color: 'Black',  isFeatured: false, images: [SHOE_IMG] },
  { name: 'Berkeley Loafer', category: 'Dress Shoes', price: '49.99',  size: 'Medium', color: 'Brown',  isFeatured: false, images: [SHOE_IMG, LEATHER_IMG] },
  { name: 'Giovanni Wing Tip', category: 'Dress Shoes', price: '129.99', size: 'Large', color: 'Brown', isFeatured: false, images: [SHOE_IMG] },
  { name: 'Sensible Bootie', category: 'Dress Shoes', price: '59.99',  size: 'Small',  color: 'Brown',  isFeatured: false, images: [SHOE_IMG] },
];

// (productName, isPaid, monthsAgo, daysOffset, productNamesInOrder)
const orders = [
  ['o1',  true,  10, 4,  ['Karley Wing Tip', 'Coastal Breeze']],
  ['o2',  true,  9,  18, ['Nebula']],
  ['o3',  true,  7,  2,  ['QuantumSole X', 'Aero Sprint', 'Street Flex 4']],
  ['o4',  false, 6,  21, ['VaporGlide Elite']],
  ['o5',  true,  5,  6,  ['Berkeley Loafer', 'Kali Oxfords']],
  ['o6',  true,  4,  14, ['Comfy Strides', 'Breeze Walk']],
  ['o7',  true,  3,  9,  ['Giovanni Wing Tip']],
  ['o8',  true,  2,  25, ['Sensible Bootie', 'Karley Wing Tip']],
  ['o9',  false, 1,  3,  ['Nebula', 'Street Flex 4']],
  ['o10', true,  0,  11, ['Aero Sprint', 'Coastal Breeze', 'Karley Wing Tip']],
];

function dateMonthsAgo(monthsAgo, dayOfMonth) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(Math.min(dayOfMonth, 28));
  d.setHours(12, 0, 0, 0);
  return d;
}

async function wipe() {
  const existing = await prisma.store.findMany({
    where: { userId: SEED_USER_ID },
    select: { id: true },
  });
  const storeIds = existing.map((s) => s.id);
  if (storeIds.length === 0) return;

  await prisma.orderItem.deleteMany({ where: { order: { storeId: { in: storeIds } } } });
  await prisma.order.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.image.deleteMany({ where: { product: { storeId: { in: storeIds } } } });
  await prisma.product.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.category.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.size.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.color.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.billboard.deleteMany({ where: { storeId: { in: storeIds } } });
  await prisma.store.deleteMany({ where: { userId: SEED_USER_ID } });
  console.log(`  wiped ${storeIds.length} existing store(s) for ${SEED_USER_ID}`);
}

async function main() {
  console.log(`Seeding for userId: ${SEED_USER_ID}`);
  await wipe();

  const store = await prisma.store.create({
    data: {
      ...(SEED_STORE_ID ? { id: SEED_STORE_ID } : {}),
      name: 'Store',
      userId: SEED_USER_ID,
    },
  });
  console.log(`  store: ${store.name} (${store.id})`);

  const billboardByKey = {};
  for (const b of billboards) {
    const created = await prisma.billboard.create({
      data: { storeId: store.id, label: b.label, imageUrl: b.imageUrl },
    });
    billboardByKey[b.key] = created;
  }
  console.log(`  billboards: ${billboards.length}`);

  const categoryByName = {};
  for (const c of categories) {
    const created = await prisma.category.create({
      data: {
        storeId: store.id,
        billboardId: billboardByKey[c.billboardKey].id,
        name: c.name,
      },
    });
    categoryByName[c.name] = created;
  }
  console.log(`  categories: ${categories.length}`);

  const sizeByName = {};
  for (const s of sizes) {
    const created = await prisma.size.create({
      data: { storeId: store.id, name: s.name, value: s.value },
    });
    sizeByName[s.name] = created;
  }

  const colorByName = {};
  for (const c of colors) {
    const created = await prisma.color.create({
      data: { storeId: store.id, name: c.name, value: c.value },
    });
    colorByName[c.name] = created;
  }
  console.log(`  sizes: ${sizes.length}, colors: ${colors.length}`);

  const productByName = {};
  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        storeId: store.id,
        categoryId: categoryByName[p.category].id,
        sizeId: sizeByName[p.size].id,
        colorId: colorByName[p.color].id,
        name: p.name,
        price: p.price,
        isFeatured: p.isFeatured,
        isArchived: false,
        images: { create: p.images.map((url) => ({ url })) },
      },
    });
    productByName[p.name] = created;
  }
  console.log(`  products: ${products.length}`);

  for (const [, isPaid, monthsAgo, day, productNames] of orders) {
    const createdAt = dateMonthsAgo(monthsAgo, day);
    await prisma.order.create({
      data: {
        storeId: store.id,
        isPaid,
        phone: isPaid ? '+15551234567' : '',
        address: isPaid ? '123 Main St, Springfield, IL 62701, US' : '',
        createdAt,
        updatedAt: createdAt,
        orderItems: {
          create: productNames.map((name) => ({ productId: productByName[name].id })),
        },
      },
    });
  }
  console.log(`  orders: ${orders.length}`);

  console.log('\nDone. Visit http://localhost:3000 (or your dev URL) to see the store.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
