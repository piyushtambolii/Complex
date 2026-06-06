"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, ArrowUpDown, Edit, Trash2, Copy, LayoutTemplate, X, Image as ImageIcon, Package } from "lucide-react";
import styles from "./products.module.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkPasteModal, setShowBulkPasteModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Forms
  const [newProduct, setNewProduct] = useState({ name: "", categoryId: "", price: "", unit: "kg" });
  const [bulkText, setBulkText] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchTemplates();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  async function fetchTemplates() {
    const res = await fetch("/api/products/templates");
    if (res.ok) {
      const data = await res.json();
      setTemplates(data);
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    const res = await fetch(`/api/products/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !currentStatus })
    });
    if (res.ok) {
      setProducts(products.map(p => p.id === id ? { ...p, isAvailable: !currentStatus } : p));
    }
  };

  const deleteProduct = async (id) => {
    if(!confirm("Are you sure?")) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if(res.ok) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    if (res.ok) {
      fetchProducts();
      setShowAddModal(false);
      setNewProduct({ name: "", categoryId: "", price: "", unit: "kg" });
    }
  };

  const handleBulkPaste = async () => {
    const res = await fetch('/api/products/bulk-paste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: bulkText })
    });
    if (res.ok) {
      fetchProducts();
      setShowBulkPasteModal(false);
      setBulkText("");
    }
  };

  const applyTemplate = async (templateId) => {
    const res = await fetch('/api/products/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId })
    });
    if (res.ok) {
      fetchProducts();
      setShowTemplateModal(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>Manage your catalog easily</p>
        </div>
        <div className={styles.actions}>
          <button onClick={() => setShowTemplateModal(true)} className={styles.btnSecondary}>
            <LayoutTemplate size={16} /> Templates
          </button>
          <button onClick={() => setShowBulkPasteModal(true)} className={styles.btnSecondary}>
            <Copy size={16} /> Bulk Paste
          </button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBtns}>
          <button className={styles.iconBtn}><Filter size={18} /></button>
          <button className={styles.iconBtn}><ArrowUpDown size={18} /></button>
        </div>
      </div>

      {loading ? <p>Loading products...</p> : (
        <div className={styles.productGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={48} className={styles.emptyIcon} />
              <h3>No products found</h3>
              <p>Add your first product to start selling!</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].imageUrl} alt={product.name} />
                  ) : (
                    <div className={styles.imagePlaceholder}><ImageIcon size={24} /></div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.price}>₹{product.price} / {product.unit}</p>
                </div>
                <div className={styles.productActions}>
                  <label className={styles.toggle}>
                    <input 
                      type="checkbox" 
                      checked={product.isAvailable} 
                      onChange={() => toggleAvailability(product.id, product.isAvailable)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <div className={styles.actionGroup}>
                    <button className={styles.actionBtn}><Edit size={16} /></button>
                    <button className={styles.actionBtn} onClick={() => deleteProduct(product.id)}>
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FAB for Mobile/Quick Access */}
      <button className={styles.fab} onClick={() => setShowAddModal(true)}>
        <Plus size={24} color="white" />
      </button>

      {/* Quick Add Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Quick Add Product</h2>
              <button onClick={() => setShowAddModal(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProduct} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={styles.input} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Unit</label>
                  <select value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className={styles.input}>
                    <option value="kg">kg</option>
                    <option value="gram">gram</option>
                    <option value="piece">piece</option>
                    <option value="liter">liter</option>
                    <option value="pack">pack</option>
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.btnPrimary}>Add Product</button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Paste Modal */}
      {showBulkPasteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Paste Bulk Products</h2>
              <button onClick={() => setShowBulkPasteModal(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.helpText}>Format: Name Price/Unit (e.g. Tomato 40/kg)</p>
              <textarea 
                rows="8" 
                value={bulkText} 
                onChange={e => setBulkText(e.target.value)} 
                className={styles.textarea}
                placeholder="Tomato 40/kg&#10;Potato 30/kg"
              />
              <button onClick={handleBulkPaste} className={styles.btnPrimary}>Import Products</button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Shop Templates</h2>
              <button onClick={() => setShowTemplateModal(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.helpText}>1-Click import standard products.</p>
              <div className={styles.templateList}>
                {templates.map(t => (
                  <div key={t.id} className={styles.templateCard}>
                    <div className={styles.templateInfo}>
                      <h4>{t.name}</h4>
                      <p>{t.description}</p>
                    </div>
                    <button onClick={() => applyTemplate(t.id)} className={styles.btnPrimarySmall}>Apply</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
