import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

const prisma = new PrismaClient();

export default async function PartnerPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  
  return <OnboardingForm categories={categories} />;
}
