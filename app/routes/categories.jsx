import { useState, useEffect } from "react";
import { getDB, saveDB, initialData } from "../interfaces/db";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    let db = getDB();
    if (!db) {
      db = initialData;
      saveDB(db);
    }
    setCategories(db.categories);
  }, []);

  // Ekleme Fonksiyonu
  const addCategory = () => {
    if (!newCategory.trim()) return;
    const db = getDB();
    const maxId = db.categories.length > 0 ? Math.max(...db.categories.map(c => c.id)) : 0;
    const updatedCategories = [...db.categories, { id: maxId + 1, name: newCategory }];
    
    db.categories = updatedCategories;
    saveDB(db);
    setCategories(updatedCategories);
    setNewCategory("");
  };

  // Silme Fonksiyonu
  const deleteCategory = (id) => {
    if (confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      const db = getDB();
      const updatedCategories = db.categories.filter(c => c.id !== id);
      db.categories = updatedCategories;
      saveDB(db);
      setCategories(updatedCategories);
    }
  };

  // Düzenleme Başlatma
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  // Düzenleme Kaydetme
  const saveEdit = () => {
    const db = getDB();
    const updatedCategories = db.categories.map(c => 
      c.id === editingId ? { ...c, name: editingName } : c
    );
    db.categories = updatedCategories;
    saveDB(db);
    setCategories(updatedCategories);
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="card shadow-sm p-4 border-warning">{/* Kategori Yönetimi Sayfası Başlangıç */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning fw-bold">
          <i className="bi bi-grid-fill me-2"></i>Kategori Yönetimi</h2>
          <span className="badge bg-secondary px-3 py-2">{categories.length} Toplam</span>
      </div>
      
      {/* Kategori Ekleme Formu */}
      <div className="row g-3 mb-5 p-3 bg-light rounded border border-warning-subtle shadow-sm">
        <label className="form-label fw-bold small text-muted">Kategori Adı</label>
        <div className="input-group">
          <input 
          type="text" 
          className="form-control" 
          placeholder="Yeni kategori adı yazın..." 
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCategory()}
        />
        <button className="btn btn-warning px-4" onClick={addCategory}>
          <i className="bi bi-plus-lg me-2"></i>Ekle
        </button>
        </div>
      </div>

      {/* Kategorileri Listeleme */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "80px" }}>ID</th>
              <th>Kategori Adı</th>
              <th className="text-end">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td><span className="text-muted fw-bold">#{cat.id}</span></td>
                <td>
                  {editingId === cat.id ? (
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={editingName} 
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  ) : (
                    <span className="fw-semibold text-dark">{cat.name}</span>
                  )}
                </td>
                <td className="text-end">
                  {editingId === cat.id ? (
                    <>
                      <button className="btn btn-success btn-sm me-2 shadow-sm" onClick={saveEdit}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="btn btn-light btn-sm shadow-sm" onClick={() => setEditingId(null)}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(cat)}>
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCategory(cat.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}