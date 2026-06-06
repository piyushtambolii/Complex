import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const district = searchParams.get('district');
  const taluka = searchParams.get('taluka');

  if (!q) return NextResponse.json({ shops: [], products: [], categories: [] });

  const searchQuery = { contains: q };

  // 1. Categories
  const categories = await prisma.category.findMany({
    where: { name: searchQuery },
    take: 5
  });

  // 2. Shops
  const shops = await prisma.shop.findMany({
    where: {
      name: searchQuery,
      ...(district && { district }),
      ...(taluka && { taluka }),
      status: "APPROVED"
    },
    take: 5
  });

  // 3. Products
  const products = await prisma.product.findMany({
    where: {
      name: searchQuery,
      isAvailable: true,
      shop: {
        ...(district && { district }),
        ...(taluka && { taluka }),
        status: "APPROVED"
      }
    },
    include: {
      shop: true
    },
    take: 10
  });

  return NextResponse.json({ categories, shops, products });
}
