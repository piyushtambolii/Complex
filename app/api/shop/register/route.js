import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { name, description, district, taluka, village, categoryId } = data;

    if (!name || !district || !taluka || !village || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;
    
    while (await prisma.shop.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const shop = await prisma.shop.create({
      data: {
        ownerId: session.user.id,
        name,
        slug,
        description,
        district,
        taluka,
        village,
        categoryId,
        status: "PENDING"
      }
    });

    // Optionally update user role to SHOP_OWNER
    if (session.user.role === "CUSTOMER") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "SHOP_OWNER" }
      });
    }

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error("Shop registration error:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "You already have a registered shop." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
