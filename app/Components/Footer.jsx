export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 d-flex align-items-center">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <a className="navbar-brand d-flex align-items-center" href="/">
              {/* İkonlu ve Modern Logo */}
              <div className="bg-warning rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" 
                   style={{ width: "40px", height: "40px" }}>
                <i className="bi bi-box-seam-fill text-white fs-4"></i>
              </div>
              <span className="fw-800 fs-4 tracking-tight">
                TOPTANCI<span className="text-warning">PRO</span>
              </span>
            </a>
            <p>Modern toptancılık çözümleri.</p>
          </div>
        </div>
        <hr />
        <p className="text-center">&copy; 2026 TOPTANCIPRO. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}