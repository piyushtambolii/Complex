import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import styles from "./admin.module.css";
import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";

export const metadata = {
  title: "Admin Panel | Complex",
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/partner");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
    // Unauthorized access attempts get kicked out to home
    redirect("/");
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <ShieldCheck size={28} color="var(--color-primary)" />
          <h2>Admin Center</h2>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/admin" className={styles.activeLink}>Dashboard</Link>
          <Link href="/admin/shops">Manage Shops</Link>
          <Link href="/admin/users">Manage Users</Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <p className={styles.roleBadge}>{session.user.role}</p>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
