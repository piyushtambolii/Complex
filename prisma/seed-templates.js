const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const templates = [
    {
      name: "Vegetable Shop Template",
      description: "Standard daily vegetables",
      items: [
        { name: "Onion", price: 35, unit: "kg", category: "vegetables" },
        { name: "Potato", price: 30, unit: "kg", category: "vegetables" },
        { name: "Tomato", price: 40, unit: "kg", category: "vegetables" },
        { name: "Cabbage", price: 20, unit: "piece", category: "vegetables" },
        { name: "Brinjal", price: 50, unit: "kg", category: "vegetables" }
      ]
    },
    {
      name: "Grocery Shop Template",
      description: "Essential household groceries",
      items: [
        { name: "Sugar", price: 45, unit: "kg", category: "grocery" },
        { name: "Rice (Basmati)", price: 60, unit: "kg", category: "grocery" },
        { name: "Wheat Flour", price: 40, unit: "kg", category: "grocery" },
        { name: "Toor Dal", price: 160, unit: "kg", category: "grocery" },
        { name: "Sunflower Oil", price: 120, unit: "liter", category: "grocery" }
      ]
    },
    {
      name: "Stationery Shop Template",
      description: "Common school and office supplies",
      items: [
        { name: "Classmate Notebook", price: 60, unit: "piece", category: "stationery" },
        { name: "Blue Pen", price: 10, unit: "piece", category: "stationery" },
        { name: "Pencil Pack", price: 50, unit: "pack", category: "stationery" },
        { name: "A4 Paper Ream", price: 250, unit: "pack", category: "stationery" },
        { name: "Eraser", price: 5, unit: "piece", category: "stationery" }
      ]
    }
  ]

  // Clear existing templates to avoid duplicates during dev
  await prisma.templateItem.deleteMany()
  await prisma.productTemplate.deleteMany()

  for (const t of templates) {
    const createdTemplate = await prisma.productTemplate.create({
      data: {
        name: t.name,
        description: t.description,
        items: {
          create: t.items
        }
      }
    })
    console.log(`Created template: ${createdTemplate.name}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
