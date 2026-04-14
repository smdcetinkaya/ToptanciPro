import { useState, useEffect } from "react";
import { getDB, saveDB, initialData } from "../Interfaces/db";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Düzenleme State'leri
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Yeni Ürün Formu State'i
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: ""
  });

  useEffect(() => {
    let db = getDB() || initialData;
    setProducts(db.products || []);
    setCategories(db.categories || []);
  }, []);

  const addProduct = () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Lütfen gerekli alanları doldurun!");
      return;
    }
    const db = getDB();
    const maxId = db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) : 0;
    const newProduct = {
      id: maxId + 1,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      categoryId: parseInt(formData.categoryId)
    };
    db.products = [...db.products, newProduct];
    saveDB(db);
    setProducts(db.products);
    setFormData({ name: "", price: "", stock: "", categoryId: "" });
  };

  const deleteProduct = (id) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const db = getDB();
      db.products = db.products.filter(p => p.id !== id);
      saveDB(db);
      setProducts(db.products);
    }
  };

  const startEdit = (prod) => {
    setEditingId(prod.id);
    setEditingData({ ...prod });
  };

  const saveEdit = () => {
    const db = getDB();
    db.products = db.products.map(p => p.id === editingId ? editingData : p);
    saveDB(db);
    setProducts(db.products);
    setEditingId(null);
  };

  return (
    <div className="card shadow-sm p-4 border-warning">{/* Ürün Yönetimi Sayfası Başlangıç */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning fw-bold ">
          <i className="bi bi-tags-fill me-2"></i>Ürün Yönetimi</h2>
          <span className="badge bg-secondary px-3 py-2">{products.length} Toplam</span>
      </div>
      

      {/* Ürün Ekleme Formu */}
      <div className="row g-3 mb-5 p-3 bg-light rounded border border-warning-subtle shadow-sm">
        <div className="col-md-4">
          <label className="form-label fw-bold small text-muted">Ürün Adı</label>
          <input 
            type="text" className="form-control" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label fw-bold small text-muted">Fiyat (₺)</label>
          <input 
            type="number" className="form-control" 
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label fw-bold small text-muted">Stok</label>
          <input 
            type="number" className="form-control" 
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold small text-muted">Kategori</label>
          <select 
            className="form-select" 
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
          >
            <option value="">Seçiniz...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-warning w-100" onClick={addProduct}>
            <i className="bi bi-plus-lg text-dark"></i>Ekle
          </button>
        </div>
      </div>

      {/* Ürünleri Listeleme */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light text-secondary">
            <tr>
              <th>ID</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th className="text-end px-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => {
              const category = categories.find(c => c.id === parseInt(prod.categoryId));
              const isEditing = editingId === prod.id;

              return (
                <tr key={prod.id} className={isEditing ? "table-warning-subtle" : ""}>
                  <td><span className="badge bg-secondary-subtle text-secondary">#{prod.id}</span></td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="text" className="form-control form-control-sm" 
                        value={editingData.name}
                        onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                      />
                    ) : (
                      <span className="fw-semibold">{prod.name}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select 
                        className="form-select form-select-sm" 
                        value={editingData.categoryId}
                        onChange={(e) => setEditingData({...editingData, categoryId: e.target.value})}
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="badge bg-light text-dark border">{category?.name || "—"}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="number" className="form-control form-control-sm" 
                        value={editingData.price}
                        onChange={(e) => setEditingData({...editingData, price: e.target.value})}
                      />
                    ) : (
                      <span className="text-dark fw-bold">{prod.price} ₺</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="number" className="form-control form-control-sm" 
                        value={editingData.stock}
                        onChange={(e) => setEditingData({...editingData, stock: e.target.value})}
                      />
                    ) : (
                      <span className={`badge ${prod.stock < 10 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                        {prod.stock} Adet
                      </span>
                    )}
                  </td>
                  <td className="text-end px-4">
                    {isEditing ? (
                      <>
                        <button className="btn btn-success btn-sm me-2 shadow-sm" onClick={saveEdit}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-secondary btn-sm shadow-sm" onClick={() => setEditingId(null)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Düzenle (Primary), Sil (Danger) */}
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(prod)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(prod.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}