import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedAdminRoutes } from "./ProtectedRoutes";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminComplaintDetailsPage from "../pages/admin/complaints/AdminComplaintDetailsPage";
import ConfirmationPage from "../pages/admin/complaints/ConfirmationPage";

import "../styles/adminStyles.css";

import { adminRoutesList } from "./adminRoutesList";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Rute ini membungkus semua halaman admin dengan AdminLayout.
        Sebaiknya, halaman login berada di luar layout ini. Lihat saran di bawah.
      */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminLoginPage />} />

        {/* Semua rute di dalam sini akan dilindungi oleh ProtectedAdminRoutes */}
        <Route element={<ProtectedAdminRoutes />}>
          {adminRoutesList.map((route) => {
            const { path, page: Page } = route;
            return <Route key={path} path={path} element={<Page />} />;
          })}

          {/* PERBAIKAN: Menambahkan 'element' untuk menampilkan halaman detail.
            Pastikan path ini sesuai dengan komponen <Link> Anda.
          */}
          <Route
            path="complaint/details/:complaintId"
            element={<AdminComplaintDetailsPage />}
          />
        </Route>
        <Route path="konfirmasi/:complaintId" element={<ConfirmationPage />} />
      </Route>
    </Routes>
  );
}
