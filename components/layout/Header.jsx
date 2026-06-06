"use client";
import { useState, useEffect } from "react";
import { MapPin, Search, ChevronDown, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import LocationModal from "./LocationModal";

export default function Header() {
  const pathname = usePathname();
  const [location, setLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      setLocation(JSON.parse(saved));
    } else {
      setShowModal(true);
    }
  }, []);

  const handleLocationSave = (loc) => {
    localStorage.setItem("userLocation", JSON.stringify(loc));
    setLocation(loc);
    setShowModal(false);
    window.location.reload(); 
  };

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/partner') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
        <div className="container">
          <div className={styles.topRow}>
            <div className={styles.locationBlock} onClick={() => setShowModal(true)}>
              <div className={styles.pinWrapper}>
                <MapPin size={20} className={styles.pinIcon} />
              </div>
              <div className={styles.locationText}>
                <div className={styles.labelGroup}>
                  <span className={styles.label}>Delivering to</span>
                  <ChevronDown size={14} className={styles.chevron} />
                </div>
                <span className={styles.value}>
                  {location ? `${location.village || location.taluka}, ${location.district}` : "Select Location"}
                </span>
              </div>
            </div>
            
            <div className={styles.actionBlock}>
              <Link href="/profile" className={styles.iconBtn}>
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Complex`} alt="User" />
              </Link>
            </div>
          </div>
          
          <div className={styles.searchContainer}>
            <Link href="/search" className={styles.searchBar}>
              <Search size={20} className={styles.searchIcon} />
              <div className={styles.searchPlaceholder}>
                <span className={styles.searchMain}>Search for</span>
                <span className={styles.searchAnimated}>&quot;Groceries&quot;</span>
              </div>
            </Link>
          </div>
        </div>
      </header>
      
      {showModal && <LocationModal onClose={() => setShowModal(false)} onSave={handleLocationSave} />}
    </>
  );
}
