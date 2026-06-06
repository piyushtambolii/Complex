import { PrismaClient } from "@prisma/client";
import styles from "./admin.module.css";
import ShopActions from "./ShopActions";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const [usersCount, shopsCount, productsCount, pendingShops] = await Promise.all([
    prisma.user.count(),
    prisma.shop.count(),
    prisma.product.count(),
    prisma.shop.findMany({
      where: { status: "PENDING" },
      include: { owner: true, category: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p>{usersCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Shops</h3>
          <p>{shopsCount}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Products</h3>
          <p>{productsCount}</p>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Pending Shop Approvals</h2>
      
      <div className={styles.tableContainer}>
        {pendingShops.length === 0 ? (
          <p style={{ padding: "var(--space-4)", color: "var(--text-secondary)" }}>
            No shops are currently pending approval.
          </p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Shop Name</th>
                <th>Owner Phone</th>
                <th>Location</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingShops.map(shop => (
                <tr key={shop.id}>
                  <td>
                    <strong>{shop.name}</strong>
                    <br/>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{shop.slug}</span>
                  </td>
                  <td>{shop.owner?.phone}</td>
                  <td>{shop.village || shop.taluka}, {shop.district}</td>
                  <td>{shop.category?.name}</td>
                  <td>
                    <ShopActions shopId={shop.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
