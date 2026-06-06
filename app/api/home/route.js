import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district');
  const taluka = searchParams.get('taluka');

  if (!district || !taluka) {
    return NextResponse.json({ error: "Location parameters required" }, { status: 400 });
  }

  // 1. Fetch Popular Categories
  const categories = await prisma.category.findMany({
    take: 8,
    // Add orderBy logic later, for now just fetch
  });

  // 2. Fetch Nearby Shops (matches district and taluka, verified, approved)
  const nearbyShops = await prisma.shop.findMany({
    where: {
      district,
      taluka,
      status: "APPROVED",
      isVerified: true
    },
    include: {
      category: true
    },
    take: 10
  });

  // 3. Fetch Recently Added Shops (matches district/taluka, ordered by createdAt)
  // For MVP, we might show unverified or pending if we want it to feel "alive", but usually we only show approved.
  // Let's show all approved shops ordered by createdAt
  const recentShops = await prisma.shop.findMany({
    where: {
      district,
      taluka,
      status: "APPROVED"
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  return NextResponse.json({ categories, nearbyShops, recentShops });
}
