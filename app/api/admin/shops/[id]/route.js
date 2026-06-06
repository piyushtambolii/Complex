import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body; // "APPROVED" or "REJECTED"

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedShop = await prisma.shop.update({
      where: { id },
      data: { 
        status,
        isVerified: status === "APPROVED",
        verifiedAt: status === "APPROVED" ? new Date() : null
      }
    });

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error("Admin shop update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
