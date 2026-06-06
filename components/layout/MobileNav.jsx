"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, Store, LayoutGrid } from "lucide-react";
import styles from "./MobileNav.module.css";

export default function MobileNav() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/partner')) {
    return null;
  }

  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}>
        <div className={styles.iconWrapper}>
          <Home size={24} strokeWidth={pathname === "/" ? 2.5 : 2} />
        </div>
        <span>Home</span>
      </Link>
      
      <Link href="/shops" className={`${styles.navItem} ${pathname === "/shops" ? styles.active : ""}`}>
        <div className={styles.iconWrapper}>
          <Store size={24} strokeWidth={pathname === "/shops" ? 2.5 : 2} />
        </div>
        <span>Shops</span>
      </Link>

      <Link href="/search" className={`${styles.navItem} ${pathname === "/search" ? styles.active : ""}`}>
        <div className={styles.iconWrapper}>
          <Search size={24} strokeWidth={pathname === "/search" ? 2.5 : 2} />
        </div>
        <span>Search</span>
      </Link>
      
      <Link href="/categories" className={`${styles.navItem} ${pathname === "/categories" ? styles.active : ""}`}>
        <div className={styles.iconWrapper}>
          <LayoutGrid size={24} strokeWidth={pathname === "/categories" ? 2.5 : 2} />
        </div>
        <span>Menu</span>
      </Link>
    </nav>
  );
}
