import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Import hook useAuth dari AuthContext untuk mengakses data user dan fungsi autentikasi
import { useAuth } from "../contexts/AuthContext";

import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import ComplaintForm from "../pages/complaints/ComplaintForm";
import Footer from "./Footer";
import ComplaintDetailsPage from "../pages/complaints/ComplaintDetailsPage";
import LoginPage from "../pages/LoginPage";
import ComplaintCheckPage from "../pages/complaints/ComplaintCheckPage";
import ComplaintDetailPage from "../pages/complaints/ComplaintDetailsPage";
import SuccessfulComplaintPage from "../pages/complaints/SuccessfulComplaintPage";
import Loading from "./Loading";

export default function ComplaintApp() {
  // Mengambil data user dan status loading dari hook useAuth
  const { user, loading } = useAuth();

  // Menampilkan komponen Loading jika status loading masih true
  if (loading) {
    return <Loading />;
  }
  // Redirect ke halaman login jika user belum login (user = null)
  if (!user) {
    return (
      <>
        <Navbar />
        <main>
          <Routes>
            <Route path="/*" element={<LoginPage />} />
          </Routes>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar logOutButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/complaints/new" element={<ComplaintForm />} />
        <Route path="/complaints/check" element={<ComplaintCheckPage />} />
        <Route
          path="/complaints/success"
          element={<SuccessfulComplaintPage />}
        />
        <Route path="/complaints/detail" element={<ComplaintDetailPage />} />"
      </Routes>
      <Footer />
    </>
  );
}
