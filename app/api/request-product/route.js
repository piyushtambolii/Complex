import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { productName, district, taluka, village } = await req.json();

  if (!productName || !district) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const requested = await prisma.requestedProduct.create({
    data: {
      productName,
      district,
      taluka,
      village
    }
  });

  return NextResponse.json(requested, { status: 201 });
}
