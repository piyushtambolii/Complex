"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Star, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [location, setLocation] = useState(null);
  const [data, setData] = useState({ categories: [], nearbyShops: [], recentShops: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      setLocation(loc);
      fetchData(loc);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchData(loc) {
    const res = await fetch(`/api/home?district=${loc.district}&taluka=${loc.taluka}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }

  if (!location) {
    return (
      <div className={styles.landing}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.heroTitle}>Your city&apos;s digital market</h1>
            <p className={styles.heroSubtitle}>
              Groceries, electronics, and daily needs from your trusted local shops.
            </p>
            <button 
              className={styles.locationBtn} 
              onClick={() => document.getElementById("location-modal") || window.location.reload()}
            >
              Set Location to Start
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className={styles.skeletonContainer}>
          <div className={`${styles.skeletonBox} skeleton`} style={{ height: '80px', marginBottom: '24px' }}></div>
          <div className={`${styles.skeletonBox} skeleton`} style={{ height: '180px', marginBottom: '24px' }}></div>
          <div className={`${styles.skeletonBox} skeleton`} style={{ height: '140px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Quick Actions / Categories (Grid 4x2) */}
      <section className={styles.section}>
        <div className={styles.quickGrid}>
          {data.categories.slice(0, 8).map((cat, i) => (
            <Link href={`/shops?category=${cat.slug}`} key={cat.id} className={styles.quickItem}>
              <div className={styles.quickIconBg}>
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${cat.name}&backgroundColor=00C896,00A37A`} alt={cat.name} />
              </div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Banners (Dense visual hook) */}
      <section className={styles.section}>
        <div className={styles.featuredScroll}>
          <div className={`${styles.featuredBanner} ${styles.bannerEmerald}`}>
            <div className={styles.bannerContent}>
              <h3>Fresh Vegetables</h3>
              <p>Direct from local mandis</p>
            </div>
          </div>
          <div className={`${styles.featuredBanner} ${styles.bannerDark}`}>
            <div className={styles.bannerContent}>
              <h3>Electronics Sale</h3>
              <p>Mobiles & Accessories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Nearby (Premium Horizontal Scroll) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Popular in {location.village || location.taluka}</h2>
          <Link href="/shops" className={styles.viewAll}>See All</Link>
        </div>
        
        <div className={styles.shopScroll}>
          {data.nearbyShops.length === 0 ? (
            <div className={styles.emptyState}>No shops found.</div>
          ) : (
            data.nearbyShops.map(shop => (
              <Link href={`/shops/${shop.slug}`} key={shop.id} className={styles.premiumShopCard}>
                <div className={styles.premiumShopBanner}>
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}&backgroundColor=047857`} alt="Banner" />
                  {shop.isVerified && (
                    <div className={styles.badgeAbsolute}>
                      <Star size={10} fill="currentColor" /> Verified
                    </div>
                  )}
                  <div className={styles.deliveryBadge}>
                    <Clock size={10} /> 30 mins
                  </div>
                </div>
                <div className={styles.premiumShopInfo}>
                  <div className={styles.shopTitleRow}>
                    <h3>{shop.name}</h3>
                    <div className={styles.ratingBadge}>
                      4.8 <Star size={10} fill="currentColor" />
                    </div>
                  </div>
                  <p className={styles.shopCategoryText}>{shop.category?.name} • {shop.village}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Recommended For You (Vertical List) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recently Added</h2>
        </div>
        
        <div className={styles.verticalShopList}>
          {data.recentShops.map(shop => (
            <Link href={`/shops/${shop.slug}`} key={shop.id} className={styles.verticalShopCard}>
              <div className={styles.vShopImage}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}&backgroundColor=18181B`} alt="Logo" />
              </div>
              <div className={styles.vShopDetails}>
                <h4>{shop.name}</h4>
                <p>{shop.category?.name}</p>
                <div className={styles.vShopTags}>
                  <span className={styles.tag}><CheckCircle2 size={12} /> Trusted</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Footer Padding for Mobile Nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
