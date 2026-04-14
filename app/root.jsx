import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import bootstrapStyles from "bootstrap/dist/css/bootstrap.min.css?url"; // Bootstrap CSS'i eklemek için
import bootstrapIcons from "bootstrap-icons/font/bootstrap-icons.css?url"; // İconları eklemek için
import Navbar from "./components/Navbar";
import Footer from "./Components/Footer";

export const links = () => [
  { rel: "stylesheet", href: bootstrapStyles },
  { rel: "stylesheet", href: bootstrapIcons },
  // Modern Font Ekliyoruz
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "true" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" }
];

export default function App() {
  return (
    <html lang="tr">
      <head>
        <Meta />
        <Links />
        <style>
          {`
            .hover-effect:hover {
              background: rgba(255, 255, 255, 0.1);
              color: #FFC107 !important;
              transition: all 0.3s ease;
            }
            .fw-800 { font-weight: 800; }
            .tracking-tight { letter-spacing: -1px; }
          `}
        </style>
      </head>
      <body className="d-flex flex-column min-vh-100 m-0">
        <Navbar />
        <div className="flex-grow-1 container my-4">
          <Outlet />
        </div>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}