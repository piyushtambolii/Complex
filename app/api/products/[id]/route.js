import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  const shop = await prisma.shop.findUnique({ where: { ownerId: session.user.id } });
  if (!shop) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({
    where: { id, shopId: shop.id }
  });

  return NextResponse.json({ success: true });
}
