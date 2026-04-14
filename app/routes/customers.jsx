import { useState, useEffect } from "react";
import { getDB, saveDB, initialData } from "../interfaces/db";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Yeni Müşteri Formu State'i
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    balance: 0
  });

  useEffect(() => {
    let db = getDB() || initialData;
    setCustomers(db.customers || []);
  }, []);

  const addCustomer = () => {
    if (!formData.name || !formData.phone) {
      alert("Müşteri adı ve telefon zorunludur!");
      return;
    }
    const db = getDB();
    const maxId = db.customers.length > 0 ? Math.max(...db.customers.map(c => c.id)) : 0;
    
    const newCustomer = {
      id: maxId + 1,
      name: formData.name,
      phone: formData.phone,
      balance: parseFloat(formData.balance) || 0
    };

    db.customers = [...db.customers, newCustomer];
    saveDB(db);
    setCustomers(db.customers);
    setFormData({ name: "", phone: "", balance: 0 });
  };

  const deleteCustomer = (id) => {
    if (confirm("Müşteriyi silmek istediğinize emin misiniz?")) {
      const db = getDB();
      db.customers = db.customers.filter(c => c.id !== id);
      saveDB(db);
      setCustomers(db.customers);
    }
  };

  const startEdit = (cust) => {
    setEditingId(cust.id);
    setEditingData({ ...cust });
  };

  const saveEdit = () => {
    const db = getDB();
    db.customers = db.customers.map(c => c.id === editingId ? editingData : c);
    saveDB(db);
    setCustomers(db.customers);
    setEditingId(null);
  };

  return (
    <div className="card shadow-sm p-4 border-warning">{/* Müşteri Yönetimi Sayfası Başlangıç */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning fw-bold">
          <i className="bi bi-people-fill me-2"></i>Müşteri Yönetimi
        </h2>
        <span className="badge bg-secondary px-3 py-2">{customers.length} Toplam</span>
      </div>

      {/* Müşteri Ekleme Formu */}
      <div className="row g-3 mb-5 p-3 bg-light rounded border border-warning-subtle shadow-sm">
        <div className="col-md-5">
          <label className="form-label fw-bold small text-muted">Müşteri / Firma Adı</label>
          <input 
            type="text" className="form-control" 
            placeholder="Örn: Örnek Ticaret"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold small text-muted">Telefon</label>
          <input 
            type="text" className="form-control" 
            placeholder="05xx..."
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold small text-muted">Başlangıç Bakiyesi (₺)</label>
          <input 
            type="number" className="form-control" 
            value={formData.balance}
            onChange={(e) => setFormData({...formData, balance: e.target.value})}
          />
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-warning w-100" onClick={addCustomer}>
            <i className="bi bi-plus-lg text-dark"></i>Ekle
          </button>
        </div>
      </div>

      {/* Müşterileri Listeleme */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light text-secondary">
            <tr>
              <th style={{width: "80px"}}>ID</th>
              <th>Müşteri Bilgisi</th>
              <th>Telefon</th>
              <th>Güncel Bakiye</th>
              <th className="text-end px-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => {
              const isEditing = editingId === cust.id;
              return (
                <tr key={cust.id} className={isEditing ? "table-warning-subtle" : ""}>
                  <td><span className="badge bg-secondary-subtle text-secondary">#{cust.id}</span></td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="text" className="form-control form-control-sm" 
                        value={editingData.name}
                        onChange={(e) => setEditingData({...editingData, name: e.target.value})}
                      />
                    ) : (
                      <span className="fw-semibold">{cust.name}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="text" className="form-control form-control-sm" 
                        value={editingData.phone}
                        onChange={(e) => setEditingData({...editingData, phone: e.target.value})}
                      />
                    ) : (
                      <span className="text-muted"><i className="bi bi-telephone me-1"></i>{cust.phone}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="number" className="form-control form-control-sm" 
                        value={editingData.balance}
                        onChange={(e) => setEditingData({...editingData, balance: e.target.value})}
                      />
                    ) : (
                      <span className={`fw-bold ${cust.balance < 0 ? 'text-danger' : 'text-success'}`}>{/*Bakiye eksi ise kırmızı, artı ise yeşil */}
                        {cust.balance.toLocaleString('tr-TR')} ₺
                      </span>
                    )}
                  </td>
                  <td className="text-end px-4">
                    {isEditing ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(cust)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteCustomer(cust.id)}>
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