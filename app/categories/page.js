import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import styles from "./categories.module.css";

const prisma = new PrismaClient();

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // Emerald/Teal gradient combinations for the cards to make them vibrant
  const colors = [
    { bg: "linear-gradient(135deg, #10B981, #047857)", shadow: "var(--shadow-glow)" },
    { bg: "linear-gradient(135deg, #0D9488, #0F766E)", shadow: "var(--shadow-layer-2)" },
    { bg: "linear-gradient(135deg, #14B8A6, #0E7490)", shadow: "var(--shadow-layer-2)" },
    { bg: "linear-gradient(135deg, #059669, #064E3B)", shadow: "var(--shadow-layer-2)" },
  ];

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>All Categories</h1>
        <p className={styles.subtitle}>Find exactly what you need in your city.</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat, index) => {
          const colorTheme = colors[index % colors.length];
          return (
            <Link 
              href={`/shops?category=${cat.slug}`} 
              key={cat.id} 
              className={styles.card}
            >
              <div 
                className={styles.cardBanner} 
                style={{ background: colorTheme.bg, boxShadow: colorTheme.shadow }}
              >
                <img 
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${cat.name}&backgroundColor=transparent`} 
                  alt={cat.name} 
                  className={styles.icon}
                />
              </div>
              <div className={styles.cardInfo}>
                <h3>{cat.name}</h3>
                <ChevronRight size={16} className={styles.arrow} />
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Footer Padding for Mobile Nav */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
