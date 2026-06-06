import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');
  const taluka = searchParams.get('taluka');
  const category = searchParams.get('category'); // optional slug

  if (!district || !taluka) {
    return NextResponse.json({ error: "Location parameters required" }, { status: 400 });
  }

  const where = {
    district,
    taluka,
    status: "APPROVED"
  };

  if (category) {
    const cat = await prisma.category.findUnique({ where: { slug: category } });
    if (cat) {
      where.categoryId = cat.id;
    }
  }

  const shops = await prisma.shop.findMany({
    where,
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return NextResponse.json(shops);
}
