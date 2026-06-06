import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Store, Package, ShoppingBag, Settings, LogOut } from "lucide-react";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "SHOP_OWNER" && session.user.role !== "ADMIN")) {
    redirect("/api/auth/signin");
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" style={{ display: 'block' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'white' }}>Complex Panel</h2>
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navLink}>
            <Store size={20} /> Overview
          </Link>
          <Link href="/dashboard/products" className={styles.navLink}>
            <Package size={20} /> Products
          </Link>
          <Link href="/dashboard/orders" className={styles.navLink}>
            <ShoppingBag size={20} /> Orders
          </Link>
          <Link href="/dashboard/settings" className={styles.navLink}>
            <Settings size={20} /> Settings
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/api/auth/signout" className={styles.navLink}>
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
