import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(name, shopId) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${shopId.slice(-4)}`;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "No shop found" }, { status: 404 });

  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

  const lines = text.split('\n').filter(line => line.trim() !== '');
  const productsToCreate = [];

  for (const line of lines) {
    // Basic regex to match "Name Price/Unit" e.g., "Tomato 40/kg"
    const match = line.match(/(.+?)\s+(\d+(?:\.\d+)?)\s*\/\s*([a-zA-Z]+)/);
    if (match) {
      productsToCreate.push({
        shopId: shop.id,
        name: match[1].trim(),
        slug: generateSlug(match[1].trim(), shop.id + Math.random().toString(36).slice(2, 6)),
        price: parseFloat(match[2]),
        unit: match[3].toLowerCase(),
        isAvailable: true
      });
    } else {
      // Fallback if they just type "Tomato 40"
      const parts = line.trim().split(/\s+/);
      const possiblePrice = parseFloat(parts[parts.length - 1]);
      if (!isNaN(possiblePrice)) {
        const name = parts.slice(0, -1).join(' ');
        productsToCreate.push({
          shopId: shop.id,
          name,
          slug: generateSlug(name, shop.id + Math.random().toString(36).slice(2, 6)),
          price: possiblePrice,
          unit: "piece", // Default fallback
          isAvailable: true
        });
      }
    }
  }

  const created = await prisma.$transaction(
    productsToCreate.map(p => prisma.product.create({ data: p }))
  );

  return NextResponse.json(created, { status: 201 });
}
