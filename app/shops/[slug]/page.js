import { PrismaClient } from "@prisma/client";
import { Star, MapPin, Phone, Package, Search } from "lucide-react";
import styles from "./shopDetail.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function ShopDetailPage({ params }) {
  const { slug } = params;

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      category: true,
      products: {
        where: { isAvailable: true }
      }
    }
  });

  if (!shop) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* Shop Header */}
      <div className={styles.shopHeader}>
        <div className={styles.shopBanner}>
           {shop.isVerified && (
             <div className={styles.verifiedBadge}>
               <Star size={14} fill="currentColor" /> Verified Business
             </div>
           )}
        </div>
        <div className={styles.shopInfo}>
          <div className={styles.titleRow}>
            <h1>{shop.name}</h1>
            <span className={styles.categoryLabel}>{shop.category?.name}</span>
          </div>
          
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <MapPin size={16} /> {shop.village}, {shop.taluka}
            </span>
            <span className={styles.metaItem}>
              <Package size={16} /> {shop.products.length} Products
            </span>
          </div>

          <div className={styles.actionRow}>
             {/* Note: Mock phone functionality for UI MVP */}
             <a href={`tel:0000000000`} className={styles.btnPrimary}>
               <Phone size={18} /> Call Shop
             </a>
             <button className={styles.btnSecondary}>Save Shop</button>
          </div>
        </div>
      </div>

      {/* Catalog */}
      <div className={styles.catalogSection}>
        <div className={styles.catalogHeader}>
          <h2>Product Catalog</h2>
          <div className={styles.searchBar}>
             <Search size={18} className={styles.searchIcon} />
             <input type="text" placeholder="Search in this shop..." className={styles.searchInput} />
          </div>
        </div>

        <div className={styles.productGrid}>
          {shop.products.length === 0 ? (
            <div className={styles.empty}>
              <p>This shop hasn&apos;t added any products yet.</p>
            </div>
          ) : (
            shop.products.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {/* Placeholder for product image */}
                </div>
                <div className={styles.productDetails}>
                  <h3>{product.name}</h3>
                  <p className={styles.price}>₹{product.price} / {product.unit}</p>
                  {/* Cart functionality is disabled for Phase 3 */}
                  <button className={styles.btnAdd} disabled>Request</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
