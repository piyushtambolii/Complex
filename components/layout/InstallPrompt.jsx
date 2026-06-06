"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import styles from "./InstallPrompt.module.css";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.promptOverlay}>
      <div className={styles.promptCard}>
        <div className={styles.iconContainer}>
          <img src="/icons/icon-192x192.png" alt="Complex App" />
        </div>
        <div className={styles.content}>
          <h4>Get the Complex App</h4>
          <p>Install our app for a faster, premium experience.</p>
        </div>
        <div className={styles.actions}>
          <button onClick={handleInstallClick} className={styles.installBtn}>
            <Download size={16} /> Install
          </button>
          <button onClick={() => setShowPrompt(false)} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
