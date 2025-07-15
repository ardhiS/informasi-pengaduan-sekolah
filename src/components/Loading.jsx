// File: Loading.jsx
// Komponen Loading menampilkan indikator loading berupa spinner dan teks
// Menggunakan Bootstrap untuk styling dan animasi spinner
// Ditampilkan di tengah layar dengan flexbox dan vh-100(unit pengukuran yang mewakili 100% dari tinggi viewport)

import React from "react";

function Loading() {
  return (
    // Container utama dengan flexbox untuk posisi tengah vertikal dan horizontal
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      {/* Spinner Bootstrap dengan warna info (biru) */}
      <div
        className="spinner-border text-info"
        role="status"
        aria-hidden="true"
        style={{ width: "3rem", height: "3rem" }}
      ></div>

      {/* Teks "Memuat..." dengan margin top dan warna abu-abu */}
      <p className="mt-3 text-muted">Memuat...</p>
    </div>
  );
}

export default Loading;
