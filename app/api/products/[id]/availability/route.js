import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { isAvailable } = await req.json();
  const { id } = params;

  // Validate ownership implicitly by looking up via session shop
  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updated = await prisma.product.update({
    where: { id, shopId: shop.id },
    data: { isAvailable }
  });

  return NextResponse.json(updated);
}
