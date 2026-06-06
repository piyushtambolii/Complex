"use client";
import { useState } from "react";
import { X, MapPin, Navigation, Edit2 } from "lucide-react";
import styles from "./LocationModal.module.css";

const DISTRICTS = ["Nandurbar", "Jalgaon", "Dhule"];

export default function LocationModal({ onClose, onSave }) {
  const [mode, setMode] = useState("initial"); // "initial" | "manual"
  const [district, setDistrict] = useState("Nandurbar");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAutoDetect = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Use Nominatim API for free reverse geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            
            if (data && data.address) {
              const address = data.address;
              // Map Nominatim address structure to District/Taluka/Village
              const resolvedDistrict = address.state_district || address.county || "Unknown District";
              // Clean "District" word if present e.g. "Nandurbar District" -> "Nandurbar"
              const cleanDistrict = resolvedDistrict.replace(/ district/i, '').trim();
              
              const resolvedTaluka = address.city_district || address.town || address.city || address.municipality || address.county || "Unknown Taluka";
              const cleanTaluka = resolvedTaluka.replace(/ taluka/i, '').trim();
              
              const resolvedVillage = address.village || address.suburb || address.neighbourhood || address.road || "Unknown Area";
              
              onSave({ 
                district: cleanDistrict, 
                taluka: cleanTaluka, 
                village: resolvedVillage 
              });
            } else {
              throw new Error("Could not parse location");
            }
          } catch (error) {
            alert("Could not determine city details. Please enter manually.");
            setMode("manual");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          alert("Location access denied. Please enter your location manually.");
          setMode("manual");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation not supported. Please enter manually.");
      setMode("manual");
      setLoading(false);
    }
  };

  const handleManualSave = (e) => {
    e.preventDefault();
    if (!district || !taluka) return alert("Please select district and taluka");
    onSave({ district, taluka, village });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Select Your Location</h2>
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn}>
              <X size={20} />
            </button>
          )}
        </div>
        <div className={styles.modalBody}>
          <div className={styles.iconWrapper}>
            <MapPin size={48} color="var(--emerald-500)" />
          </div>
          <p className={styles.helpText}>
            We need your location to show products and shops available in your city.
          </p>
          
          {mode === "initial" ? (
            <div className={styles.optionsContainer}>
              <button 
                className={`${styles.btnPrimary} ${styles.btnIcon}`} 
                onClick={handleAutoDetect}
                disabled={loading}
              >
                <Navigation size={18} />
                {loading ? "Detecting..." : "Use Current Location"}
              </button>
              
              <div className={styles.divider}>
                <span>OR</span>
              </div>
              
              <button 
                className={`${styles.btnSecondary} ${styles.btnIcon}`} 
                onClick={() => setMode("manual")}
                disabled={loading}
              >
                <Edit2 size={18} />
                Enter Location Manually
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSave} className={styles.manualForm}>
              <div className={styles.formGroup}>
                <label>District</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} required className={styles.input}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Taluka</label>
                <input type="text" value={taluka} onChange={e => setTaluka(e.target.value)} placeholder="e.g. Shahada" required className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label>Area / Village</label>
                <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="e.g. Prakasha" className={styles.input} />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setMode("initial")} className={styles.btnText}>Back</button>
                <button type="submit" className={styles.btnPrimary}>Save Location</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
