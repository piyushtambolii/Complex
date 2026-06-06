import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const templates = await prisma.productTemplate.findMany({
    include: { items: true }
  });
  return NextResponse.json(templates);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });

  const { templateId } = await req.json();
  
  const template = await prisma.productTemplate.findUnique({
    where: { id: templateId },
    include: { items: true }
  });

  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

  const productsToCreate = template.items.map(item => ({
    shopId: shop.id,
    name: item.name,
    slug: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${shop.id.slice(-4)}-${Math.random().toString(36).slice(2, 6)}`,
    price: item.price,
    unit: item.unit,
    isAvailable: true
  }));

  const created = await prisma.$transaction(
    productsToCreate.map(p => prisma.product.create({ data: p }))
  );

  return NextResponse.json(created, { status: 201 });
}
