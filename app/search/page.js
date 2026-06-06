"use client";
import { useState, useEffect } from "react";
import { Search, Store, Package, Layers, Plus } from "lucide-react";
import Link from "next/link";
import styles from "./search.module.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ categories: [], shops: [], products: [] });
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      setLocation(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 1 && location) {
        performSearch();
      } else {
        setResults({ categories: [], shops: [], products: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, location]);

  const performSearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&district=${location.district}&taluka=${location.taluka}`);
    if (res.ok) {
      const data = await res.json();
      setResults(data);
    }
    setLoading(false);
    setRequestSent(false);
  };

  const handleRequestProduct = async () => {
    const res = await fetch('/api/request-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: query,
        district: location.district,
        taluka: location.taluka,
        village: location.village
      })
    });
    if (res.ok) {
      setRequestSent(true);
    }
  };

  const hasResults = results.categories.length > 0 || results.shops.length > 0 || results.products.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.searchHeader}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products, shops, categories..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
        </div>
      </div>

      <div className={styles.resultsContainer}>
        {loading && <p className={styles.statusText}>Searching locally...</p>}

        {!loading && query.length > 1 && !hasResults && (
          <div className={styles.emptyState}>
            <Search size={48} className={styles.emptyIcon} />
            <h3>Couldn&apos;t find &quot;{query}&quot;</h3>
            <p>We&apos;re still growing our network of shops in {location?.village || location?.taluka}.</p>
            
            <button 
              className={styles.btnPrimary} 
              onClick={handleRequestProduct}
              disabled={requestSent}
            >
              {requestSent ? "Request Sent!" : "Request this product"}
            </button>
            {!requestSent && <p className={styles.smallText}>We'll notify local shops about this demand.</p>}
          </div>
        )}

        {!loading && hasResults && (
          <div className={styles.resultsWrapper}>
            {/* Categories */}
            {results.categories.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.sectionTitle}><Layers size={16}/> Categories</h3>
                <div className={styles.categoryList}>
                  {results.categories.map(cat => (
                    <Link href={`/shops?category=${cat.slug}`} key={cat.id} className={styles.categoryItem}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Shops */}
            {results.shops.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.sectionTitle}><Store size={16}/> Shops</h3>
                <div className={styles.shopList}>
                  {results.shops.map(shop => (
                    <Link href={`/shops/${shop.slug}`} key={shop.id} className={styles.shopItem}>
                      <div className={styles.shopAvatar}><Store size={20} /></div>
                      <div>
                        <h4>{shop.name}</h4>
                        <p>{shop.village}, {shop.taluka}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {results.products.length > 0 && (
              <div className={styles.resultSection}>
                <h3 className={styles.sectionTitle}><Package size={16}/> Products</h3>
                <div className={styles.productList}>
                  {results.products.map(product => (
                    <Link href={`/shops/${product.shop.slug}`} key={product.id} className={styles.productItem}>
                      <div className={styles.productDetails}>
                        <h4>{product.name}</h4>
                        <p className={styles.productPrice}>₹{product.price} / {product.unit}</p>
                        <p className={styles.productShop}>Sold by: {product.shop.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Appended Request Button if didn't find exact match */}
            <div className={styles.requestBanner}>
              <p>Didn&apos;t find exactly what you need?</p>
              <button 
                className={styles.btnSecondary} 
                onClick={handleRequestProduct}
                disabled={requestSent}
              >
                {requestSent ? "Request Sent!" : "Request Product"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
