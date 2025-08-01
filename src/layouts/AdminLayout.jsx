// src/layouts/AdminLayout.jsx (VERSI BARU YANG LEBIH BAIK)

import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

export default function AdminLayout() {
  const location = useLocation();

  // Hanya untuk membedakan halaman login, tanpa logika tinggi halaman
  const isLoginPage =
    location.pathname === "/admin" || location.pathname === "/admin/";

  if (isLoginPage) {
    // Halaman login tidak memerlukan layout sticky footer
    return (
      <>
        <AdminHeader />
        <main>
          <Outlet />
        </main>
      </>
    );
  }

  // Layout utama untuk semua halaman admin lainnya
  return (
    // Tambahkan div pembungkus dengan class untuk styling
    <div className="admin-layout-wrapper">
      <AdminHeader isUseLogo logOutButton />
      {/* Beri class pada main untuk membuatnya fleksibel */}
      <main className="admin-main-content">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  );
}
