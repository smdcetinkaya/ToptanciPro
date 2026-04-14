export default function Navbar() {
  return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-3" 
             style={{ fontFamily: "'Inter', sans-serif", borderBottom: "1px solid #333" }}>
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="/">
              {/* İkonlu ve Modern Logotype */}
              <div className="bg-warning rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" 
                   style={{ width: "40px", height: "40px" }}>
                <i className="bi bi-box-seam-fill text-white fs-4"></i>
              </div>
              <span className="fw-800 fs-4 tracking-tight">
                TOPTANCI<span className="text-warning">PRO</span>
              </span>
            </a>
                  
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
                  
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto gap-2">
                <li className="nav-item">
                  <a className="nav-link px-3 rounded-pill hover-effect" href="/orders">
                    <i className="bi bi-cart3 me-2"></i>Siparişler
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link px-3 rounded-pill hover-effect" href="/customers">
                    <i className="bi bi-people me-2"></i>Müşteriler
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link px-3 rounded-pill hover-effect" href="/products">
                    <i className="bi bi-tags me-2"></i>Ürünler
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link px-3 rounded-pill hover-effect" href="/categories">
                    <i className="bi bi-grid me-2"></i>Kategoriler
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  );
}