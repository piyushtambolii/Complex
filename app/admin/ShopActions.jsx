"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function ShopActions({ shopId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this shop?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/shops/${shopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Action failed");
      }
    } catch (e) {
      alert("Error processing action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.actionBtnGroup}>
      <button 
        disabled={loading} 
        className={styles.btnApprove} 
        onClick={() => handleAction("APPROVED")}
      >
        Approve
      </button>
      <button 
        disabled={loading} 
        className={styles.btnReject}
        onClick={() => handleAction("REJECTED")}
      >
        Reject
      </button>
    </div>
  );
}
