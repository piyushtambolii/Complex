import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import styles from "./dashboard.module.css";

const prisma = new PrismaClient();

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/partner");
  }
  
  const shop = await prisma.shop.findUnique({
    where: { ownerId: session.user.id }
  });

  if (!shop) {
    return (
      <div>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.card}>
          <p>You haven&apos;t registered a shop yet. Please go to the onboarding page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Overview</h1>
      </div>

      <div className={styles.card}>
        <h2>{shop.name}</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
          Status: <strong style={{ color: shop.status === "APPROVED" ? "var(--color-emerald)" : "#f59e0b" }}>{shop.status}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className={styles.card}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Total Products</h3>
          <p style={{ fontSize: "2rem", fontWeight: 600, marginTop: "0.5rem" }}>0</p>
        </div>
        <div className={styles.card}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Pending Orders</h3>
          <p style={{ fontSize: "2rem", fontWeight: 600, marginTop: "0.5rem" }}>0</p>
        </div>
        <div className={styles.card}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Today&apos;s Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: 600, marginTop: "0.5rem" }}>₹0</p>
        </div>
      </div>
    </div>
  );
}
