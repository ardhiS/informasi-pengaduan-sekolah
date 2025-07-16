import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import SecurityAlert from "../../components/SecurityAlert";

export default function SuccessfulComplaintPage() {
  //state untuk menyimpan ID Pengaduan yang berhasil dikirim
  const [complaintId, setComplaintId] = useState("");

  useEffect(() => {
    //ambil ID Pengaduan terbaru dari local storage
    const savedId = localStorage.getItem("currentComplaintId");
    //jika ID ditemukan, simpan di state dan hapus saat di refresh
    if (savedId) {
      setComplaintId(savedId); //simpan ID ke state agar bisa di tampilkan
      localStorage.removeItem("currentComplaintId"); //hapus ID saat di refresh
    }
  }, []);

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          {/* <!-- Card konfirmasi pengaduan berhasil --> */}
          <div className="card border-0 bg-body-secondary mt-4">
            <div className="card-body p-4 text-center">
              {/* <!-- Icon sukses --> */}
              <div className="mb-4">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "3.5rem" }}
                ></i>
              </div>
              {/* <!-- Pesan sukses --> */}
              <h3 className="fw-bold text-success mb-3 fs-4">
                Pengaduan Berhasil Terkirim
              </h3>
              <p className="text-muted mb-5 fs-6">
                Terima kasih telah mempercayai sistem pengaduan kami.
              </p>

              {/* <!-- Box kode pengaduan --> */}
              <div className="alert alert-light border border-info rounded-3 mb-4">
                <h5 className="fw-semibold mb-3 text-info fs-5">
                  Kode Pengaduan Anda
                </h5>
                {/* <!-- Display kode pengaduan --> */}
                <div className="bg-white border rounded-3 p-3 mb-3">
                  <h4 className="fw-bold text-dark mb-0 font-monospace fs-4">
                    {/* menampilkan ID Pengaduan yg baru dikirim */}
                    {complaintId}
                  </h4>
                </div>
                {/* <!-- Peringatan penting --> */}
                <div className="mb-3">
                  <p className="fw-medium text-body mb-2">
                    <i className="bi bi-exclamation-circle text-info me-2"></i>
                    Penting: Simpan kode ini dengan aman!
                  </p>
                  <p className="small text-muted mb-0">
                    Tanpa kode tersebut, Anda tidak akan dapat memeriksa status
                    laporan atau berkomunikasi lebih lanjut.
                  </p>
                </div>
                {/* <!-- Tombol aksi --> */}
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <button className="btn btn-info btn-lg px-4 fw-medium">
                    <i className="bi bi-clipboard me-2"></i>Salin Kode
                  </button>
                  <Link
                    to={"/complaints/check"}
                    className="btn btn-outline-info btn-lg px-4 fw-medium"
                  >
                    <i className="bi bi-search me-2"></i>Cek Pengaduan
                  </Link>
                </div>
              </div>

              {/* <!-- Pesan konfirmasi --> */}
              <p className="text-muted mb-4 fs-6">
                Laporan sudah kami terima dan akan ditindaklanjuti segera. Anda
                akan mendapatkan tanggapan melalui sistem ini.
              </p>

              {/* <!-- Tombol kembali ke beranda --> */}
              <Link to={"/"} className="btn btn-info btn-lg px-4 fw-medium">
                <i className="bi bi-house me-2"></i>Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Alert informasi keamanan --> */}
      <SecurityAlert />
    </main>
  );
}
