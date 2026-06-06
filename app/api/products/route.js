import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(name, shopId) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${shopId.slice(-4)}`;
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });

  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(products);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });

  const data = await req.json();
  const { name, price, unit, categoryId } = data;

  const product = await prisma.product.create({
    data: {
      shopId: shop.id,
      name,
      slug: generateSlug(name, shop.id),
      price: parseFloat(price),
      unit,
      categoryId: categoryId || null,
      isAvailable: true
    }
  });

  return NextResponse.json(product, { status: 201 });
}
