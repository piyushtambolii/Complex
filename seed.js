const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Grocery', slug: 'grocery' },
    { name: 'Fruits', slug: 'fruits' },
    { name: 'Vegetables', slug: 'vegetables' },
    { name: 'Stationery', slug: 'stationery' },
    { name: 'Mobile Accessories', slug: 'mobile-accessories' },
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Hardware', slug: 'hardware' },
    { name: 'Electrical Items', slug: 'electrical-items' },
    { name: 'Cosmetics', slug: 'cosmetics' },
    { name: 'Gifts', slug: 'gifts' },
    { name: 'Household Goods', slug: 'household-goods' },
    { name: 'General Stores', slug: 'general-stores' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
