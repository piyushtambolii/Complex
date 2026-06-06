"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, Star, Search, Filter } from "lucide-react";
import styles from "./shops.module.css";

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      const loc = JSON.parse(saved);
      setLocation(loc);
      fetchShops(loc);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchShops(loc) {
    // Basic fetch based on location. Real app uses query params for filtering
    const res = await fetch(`/api/shops?district=${loc.district}&taluka=${loc.taluka}`);
    if (res.ok) {
      const data = await res.json();
      setShops(data);
    }
    setLoading(false);
  }

  if (!location) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Please select your location first</h2>
        <p>Use the top bar to set your location.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Shops in {location.village || location.taluka}</h1>
        <div className={styles.actions}>
          <button className={styles.iconBtn}><Filter size={20} /></button>
        </div>
      </div>

      {loading ? <p className={styles.loading}>Loading shops...</p> : (
        <div className={styles.shopGrid}>
          {shops.length === 0 ? (
            <div className={styles.empty}>
              <Store size={48} className={styles.emptyIcon} />
              <h3>No shops found</h3>
              <p>Be the first to register a shop in this area!</p>
              <Link href="/partner" className={styles.btnPrimary}>Register Shop</Link>
            </div>
          ) : (
            shops.map(shop => (
              <Link href={`/shops/${shop.slug}`} key={shop.id} className={styles.shopCard}>
                <div className={styles.shopBanner}>
                  {shop.isVerified && (
                    <div className={styles.verifiedBadge}>
                      <Star size={12} fill="currentColor" /> Verified Local
                    </div>
                  )}
                </div>
                <div className={styles.shopInfo}>
                  <div className={styles.shopTitleRow}>
                    <h3>{shop.name}</h3>
                    <span className={styles.shopCategory}>{shop.category?.name}</span>
                  </div>
                  <p className={styles.shopArea}>{shop.village}, {shop.taluka}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
