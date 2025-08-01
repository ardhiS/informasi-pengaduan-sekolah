import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
// Mengasumsikan path ke utilitas API, sesuaikan jika perlu
import * as api from "../../utils/api";

export default function AdminHomePage() {
  const [summary, setSummary] = useState({
    baru: 0,
    pending: 0,
    selesai: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummaryData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mengambil data untuk setiap status secara paralel
      const [baruRes, diprosesRes, selesaiRes] = await Promise.all([
        // "Baru" di home page sama dengan "pending_approval" di API
        api.getComplaints({ status: "pending_approval" }),
        // "Pending" di home page sama dengan "in_progress" di API
        api.getComplaints({ status: "in_progress" }),
        // "Selesai" di home page sama dengan "resolved" di API
        api.getComplaints({ status: "resolved" }),
      ]);

      // Memperbarui state dengan jumlah data dari setiap response
      setSummary({
        baru: baruRes.data.complaints?.length || 0,
        pending: diprosesRes.data.complaints?.length || 0,
        selesai: selesaiRes.data.complaints?.length || 0,
      });
      setError(null); // Menghapus error sebelumnya jika berhasil
    } catch (err) {
      setError("Gagal memuat ringkasan data pengaduan.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaryData();
    // Menambahkan event listener untuk memuat ulang data saat window kembali fokus
    window.addEventListener("focus", fetchSummaryData);
    return () => {
      window.removeEventListener("focus", fetchSummaryData);
    };
  }, [fetchSummaryData]);

  const renderSummary = () => {
    if (isLoading) {
      return <div className="text-center p-4">Memuat data ringkasan...</div>;
    }

    if (error) {
      return <div className="alert alert-danger">{error}</div>;
    }

    return (
      <div className="row g-3 text-center">
        <div className="col-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <i className="bi bi-journal-plus fs-3"></i>
              <h6 className="mb-0 mt-1">Baru</h6>
              <p className="fs-4 fw-bold mb-0">{summary.baru}</p>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <i className="bi bi-hourglass-split fs-3"></i>
              <h6 className="mb-0 mt-1">Diproses</h6>
              <p className="fs-4 fw-bold mb-0">{summary.pending}</p>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <i className="bi bi-check2-circle fs-3"></i>
              <h6 className="mb-0 mt-1">Selesai</h6>
              <p className="fs-4 fw-bold mb-0">{summary.selesai}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card text-white bg-primary mb-4">
        <div className="card-body">
          <h4 className="card-title">Selamat Datang, Admin!</h4>
          <p className="card-text mb-0">
            Lihat ringkasan dan kelola data melalui menu di bawah ini.
          </p>
        </div>
      </div>

      <h5 className="mb-3">Ringkasan Pengaduan</h5>
      {renderSummary()}

      <h5 className="my-4">Aksi Cepat</h5>
      <div className="row g-3 text-center">
        <div className="col-6">
          <Link to={"/admin/teachers/list"} className="text-decoration-none">
            <div className="card card-hover">
              <div className="card-body">
                <div
                  className="feature-icon"
                  style={{ color: "#0d6efd", backgroundColor: "#cfe2ff" }}
                >
                  <i className="bi bi-person-lines-fill"></i>
                </div>
                <span className="fw-bold">List Guru</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-6">
          <Link to={"/admin/students/list"} className="text-decoration-none">
            <div className="card card-hover">
              <div className="card-body">
                <div
                  className="feature-icon"
                  style={{ color: "#0d6efd", backgroundColor: "#cfe2ff" }}
                >
                  <i className="bi bi-people-fill"></i>
                </div>
                <span className="fw-bold">List Siswa</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-6">
          <Link to={"/admin/add/teacher"} className="text-decoration-none">
            <div className="card card-hover">
              <div className="card-body">
                <div
                  className="feature-icon"
                  style={{ color: "#198754", backgroundColor: "#d1e7dd" }}
                >
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <span className="fw-bold">Tambah Guru</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-6">
          <Link to={"/admin/add/student"} className="text-decoration-none">
            <div className="card card-hover">
              <div className="card-body">
                <div
                  className="feature-icon"
                  style={{ color: "#198754", backgroundColor: "#d1e7dd" }}
                >
                  <i className="bi bi-person-plus-fill"></i>
                </div>
                <span className="fw-bold">Tambah Siswa</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
