const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'Grocery', slug: 'grocery', icon: 'ShoppingBasket' },
    { name: 'Fruits', slug: 'fruits', icon: 'Apple' },
    { name: 'Vegetables', slug: 'vegetables', icon: 'Carrot' },
    { name: 'Stationery', slug: 'stationery', icon: 'PenTool' },
    { name: 'Mobile Accessories', slug: 'mobile-accessories', icon: 'Smartphone' },
    { name: 'Electronics', slug: 'electronics', icon: 'Monitor' },
    { name: 'Hardware', slug: 'hardware', icon: 'Wrench' },
    { name: 'Electrical Items', slug: 'electrical', icon: 'Zap' },
    { name: 'Cosmetics', slug: 'cosmetics', icon: 'Sparkles' },
    { name: 'Gifts', slug: 'gifts', icon: 'Gift' },
    { name: 'Household Goods', slug: 'household', icon: 'Home' },
    { name: 'General Stores', slug: 'general', icon: 'Store' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Categories seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
