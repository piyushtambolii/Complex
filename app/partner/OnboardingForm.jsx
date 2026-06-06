"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import styles from "./onboarding.module.css";

const DISTRICTS = ["Nandurbar", "Jalgaon", "Dhule"];

export default function OnboardingForm({ categories }) {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    description: "",
    categoryId: categories[0]?.id || "",
    district: "Nandurbar",
    taluka: "",
    village: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Authenticate user inline if not logged in
      if (status === "unauthenticated") {
        const authRes = await signIn("credentials", {
          phone: formData.phone,
          otp: "1234", // Simulated OTP for MVP phase
          redirect: false
        });

        if (authRes?.error) {
          alert("Failed to authenticate with that phone number.");
          setLoading(false);
          return;
        }
      }

      // 2. Register Shop securely
      const res = await fetch("/api/shop/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const error = await res.json();
        alert(error.error || "Failed to onboard shop");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} suppressHydrationWarning>
      <div className={styles.formCard}>
        <h1 className={styles.title}>Register Your Shop</h1>
        <p className={styles.subtitle}>Join your city&apos;s digital market in 2 minutes.</p>
        
        <form onSubmit={handleSubmit} className={styles.form} suppressHydrationWarning>
          {status === "unauthenticated" && (
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="tel" 
                required 
                value={formData.phone} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
                className={styles.input}
                placeholder="e.g. 9876543210"
              />
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                We use your phone number to create your secure shop owner account.
              </p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Shop Name</label>
            <input 
              type="text" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className={styles.input}
              placeholder="e.g. Ramesh General Store"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description (Optional)</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className={styles.input}
              rows="3"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Shop Category</label>
            <select 
              required 
              value={formData.categoryId} 
              onChange={e => setFormData({...formData, categoryId: e.target.value})} 
              className={styles.input}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.locationGrid}>
            <div className={styles.formGroup}>
              <label>District</label>
              <select 
                required 
                value={formData.district} 
                onChange={e => setFormData({...formData, district: e.target.value})} 
                className={styles.input}
              >
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Taluka</label>
              <input 
                type="text" 
                required 
                value={formData.taluka} 
                onChange={e => setFormData({...formData, taluka: e.target.value})} 
                className={styles.input}
                placeholder="e.g. Shahada"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Area / Village</label>
            <input 
              type="text" 
              required 
              value={formData.village} 
              onChange={e => setFormData({...formData, village: e.target.value})} 
              className={styles.input}
              placeholder="e.g. Prakasha"
            />
          </div>

          <button type="submit" disabled={loading ? true : undefined} className={styles.btnPrimary} suppressHydrationWarning>
            {loading ? "Registering..." : "Register Shop"}
          </button>
        </form>
      </div>
    </div>
  );
}
