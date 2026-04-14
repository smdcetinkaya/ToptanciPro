import { useState, useEffect } from "react";
import { getDB, saveDB, initialData } from "../Interfaces/db";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Düzenleme State'leri
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Yeni Sipariş Formu State'i
  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: 1
  });

  useEffect(() => {
    const db = getDB() || initialData;
    setOrders(db.orders || []);
    setCustomers(db.customers || []);
    setProducts(db.products || []);
  }, []);

  const createOrder = () => {
    const { customerId, productId, quantity } = formData;
    if (!customerId || !productId || quantity <= 0) {
      alert("Lütfen tüm alanları doğru doldurun!");
      return;
    }

    const db = getDB();
    const product = db.products.find(p => p.id === parseInt(productId));
    const customer = db.customers.find(c => c.id === parseInt(customerId));

    if (product.stock < quantity) {
      alert(`Yetersiz stok! Mevcut stok: ${product.stock}`);
      return;
    }

    const totalPrice = product.price * quantity;
    const maxId = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.id)) : 0;

    const newOrder = {
      id: maxId + 1,
      customerId: customer.id,
      customerName: customer.name,
      productName: product.name,
      quantity: parseInt(quantity),
      totalPrice: totalPrice,
      date: new Date().toLocaleString("tr-TR")
    };

    db.products = db.products.map(p => 
      p.id === product.id ? { ...p, stock: p.stock - quantity } : p
    );

    db.customers = db.customers.map(c => 
      c.id === customer.id ? { ...c, balance: c.balance - totalPrice } : c
    );

    db.orders = [newOrder, ...db.orders];
    
    saveDB(db);
    setOrders(db.orders);
    setProducts(db.products);
    setCustomers(db.customers);
    setFormData({ customerId: "", productId: "", quantity: 1 });
    
    alert("Sipariş başarıyla oluşturuldu!");
  };

  const deleteOrder = (order) => {
    if (confirm("Siparişi silmek (ve işlemleri geri almak) istiyor musunuz?")) {
      const db = getDB();
      db.products = db.products.map(p => 
        p.name === order.productName ? { ...p, stock: p.stock + order.quantity } : p
      );
      db.customers = db.customers.map(c => 
        c.id === order.customerId ? { ...c, balance: c.balance + order.totalPrice } : c
      );
      db.orders = db.orders.filter(o => o.id !== order.id);
      saveDB(db);
      setOrders(db.orders);
      setProducts(db.products);
      setCustomers(db.customers);
    }
  };

  const startEdit = (order) => {
    setEditingId(order.id);
    const db = getDB();
    const foundProduct = db.products.find(p => p.name === order.productName);
    setEditingData({ 
      ...order, 
      productId: foundProduct?.id || "",
      customerId: order.customerId 
    });
  };

  const saveEdit = () => {
    const db = getDB();
    const oldOrder = db.orders.find(o => o.id === editingId);
    const newProduct = db.products.find(p => p.id === parseInt(editingData.productId));
    const newCustomer = db.customers.find(c => c.id === parseInt(editingData.customerId));

    // 1. Geri al
    db.products = db.products.map(p => 
      p.name === oldOrder.productName ? { ...p, stock: p.stock + oldOrder.quantity } : p
    );
    db.customers = db.customers.map(c => 
      c.id === oldOrder.customerId ? { ...c, balance: c.balance + oldOrder.totalPrice } : c
    );

    // 2. Stok Kontrolü
    const currentStock = db.products.find(p => p.id === newProduct.id).stock;
    if (currentStock < editingData.quantity) {
      alert("Yetersiz stok! İşlem iptal edildi.");
      return;
    }

    // 3. Uygula
    const newTotalPrice = newProduct.price * editingData.quantity;
    db.products = db.products.map(p => 
      p.id === newProduct.id ? { ...p, stock: p.stock - editingData.quantity } : p
    );
    db.customers = db.customers.map(c => 
      c.id === newCustomer.id ? { ...c, balance: c.balance - newTotalPrice } : c
    );

    const updatedOrder = {
      ...oldOrder,
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      productName: newProduct.name,
      quantity: parseInt(editingData.quantity),
      totalPrice: newTotalPrice
    };

    db.orders = db.orders.map(o => o.id === editingId ? updatedOrder : o);
    saveDB(db);
    setOrders(db.orders);
    setProducts(db.products);
    setCustomers(db.customers);
    setEditingId(null);
  };

  return (
    <div className="card shadow-sm p-4 border-warning">{/* Sipariş Yönetimi Sayfası Başlangıç */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning mb-4 fw-bold">
          <i className="bi bi-cart-fill me-2"></i>Sipariş Yönetimi
        </h2>
        <span className="badge bg-secondary px-3 py-2">{orders.length} Toplam</span>
      </div>

      {/* Sipariş Oluşturma Formu */}
      <div className="row g-3 mb-5 p-3 bg-light rounded border border-warning-subtle shadow-sm">
        <div className="col-md-4">
          <label className="form-label fw-bold small text-muted">Müşteri Seçin</label>
          <select 
            className="form-select border-warning-subtle" 
            value={formData.customerId}
            onChange={(e) => setFormData({...formData, customerId: e.target.value})}
          >
            <option value="">Müşteri...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name} (Bakiye: {c.balance}₺)</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-bold small text-muted">Ürün Seçin</label>
          <select 
            className="form-select border-warning-subtle" 
            value={formData.productId}
            onChange={(e) => setFormData({...formData, productId: e.target.value})}
          >
            <option value="">Ürün...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-bold small text-muted">Adet</label>
          <input 
            type="number" className="form-control border-warning-subtle" 
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          />
        </div>
        <div className="col-md-1 d-flex align-items-end">
          <button className="btn btn-warning w-100" onClick={createOrder}>
            <i className="bi bi-plus-lg text-dark"></i>Ekle
          </button>
        </div>
      </div>

      {/* Listeleme */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light text-secondary">
            <tr>
              <th>ID</th>
              <th>Tarih</th>
              <th>Müşteri</th>
              <th>Ürün / Adet</th>
              <th>Toplam Tutar</th>
              <th className="text-end px-4">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const isEditing = editingId === order.id;
              return (
                <tr key={order.id} className={isEditing ? "table-warning-subtle" : ""}>
                  <td><span className="badge bg-secondary-subtle text-secondary">#{order.id}</span></td>
                  <td className="small text-muted">{order.date}</td>
                  <td>
                    {isEditing ? (
                      <select 
                        className="form-select form-select-sm" 
                        value={editingData.customerId}
                        onChange={(e) => setEditingData({...editingData, customerId: e.target.value})}
                      >
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      <span className="fw-semibold text-primary">{order.customerName}</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="d-flex gap-2">
                        <select 
                          className="form-select form-select-sm" 
                          value={editingData.productId}
                          onChange={(e) => setEditingData({...editingData, productId: e.target.value})}
                        >
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input 
                          type="number" className="form-control form-control-sm" style={{width: '70px'}}
                          value={editingData.quantity}
                          onChange={(e) => setEditingData({...editingData, quantity: e.target.value})}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="fw-bold">{order.productName}</span> 
                        <span className="badge bg-light text-dark ms-2 border">{order.quantity} Adet</span>
                      </>
                    )}
                  </td>
                  <td className="fw-bold text-success">
                    {isEditing ? <small className="text-muted italic">Hesaplanıyor...</small> : `${order.totalPrice.toLocaleString('tr-TR')} ₺`}
                  </td>
                  <td className="text-end px-4">
                    {isEditing ? (
                      <>
                        <button className="btn btn-success btn-sm me-2 shadow-sm" onClick={saveEdit}><i className="bi bi-check-lg"></i></button>
                        <button className="btn btn-secondary btn-sm shadow-sm" onClick={() => setEditingId(null)}><i className="bi bi-x-lg"></i></button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(order)}>
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteOrder(order)}>
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