import { useState, useEffect } from "react";
import { getDB, initialData } from "../interfaces/db";

export default function Index() {
  const [stats, setStats] = useState({
    orders: 0,
    customers: 0,
    products: 0,
    categories: 0
  });

  useEffect(() => {
    const db = getDB() || initialData;
    setStats({
      orders: db.orders?.length || 0,
      customers: db.customers?.length || 0,
      products: db.products?.length || 0,
      categories: db.categories?.length || 0
    });
  }, []);

  const statCards = [
    { label: "Sipariş", value: stats.orders, icon: "bi-cart-check", color: "bg-primary" },
    { label: "Müşteri", value: stats.customers, icon: "bi-people", color: "bg-success" },
    { label: "Ürün", value: stats.products, icon: "bi-box-seam", color: "bg-warning" },
    { label: "Kategori", value: stats.categories, icon: "bi-tags", color: "bg-info" }
  ];

  return (
    <div className="container-fluid py-4">
      {/* Üstteki Dört Kutu */}
      <div className="row g-4 mb-5">
        {statCards.map((item, index) => (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm h-100 overflow-hidden">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.8rem' }}>
                      {item.label}
                    </h6>
                    <h2 className="fw-bold mb-0">{item.value}+</h2>
                  </div>
                  <div className={`${item.color} bg-opacity-10 p-3 rounded-3 text-dark`}>
                    <i className={`bi ${item.icon} fs-2 text-${item.color.replace('bg-', '')}`}></i>
                  </div>
                </div>
              </div>
              <div className={item.color} style={{ height: '4px' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Karşılama Alanı */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm bg-dark text-white p-5 text-center overflow-hidden position-relative">
            {/* Arkaplanda hafif bir dekorasyon */}
            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>
            
            <div className="position-relative">
              <h1 className="display-4 fw-bold mb-3">
                <span className="text-warning">ToptancıPro</span> ile İşiniz Güvende
              </h1>
              <p className="lead opacity-75 mb-0">
                Gelişmiş takip sistemi ve kolay yönetim paneli ile <strong>ToptancıPro</strong> hizmetinizde.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}