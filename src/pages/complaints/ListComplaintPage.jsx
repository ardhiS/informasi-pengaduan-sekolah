import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { formatDate } from "../../utils";
import SecurityAlert from "../../components/SecurityAlert";

export default function ListComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = () => {
      const savedComplaints = JSON.parse(
        localStorage.getItem("complaints") || "[]"
      );

      const sortedComplaints = savedComplaints.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setComplaints(sortedComplaints);
      setLoading(false);
    };

    loadComplaints();
  }, []);

  if (loading) {
    return (
      <main className="container my-5">
        <div className="text-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h1 className="display-6 fw-bold mb-3 text-info">Semua Pengaduan</h1>
          <p className="fs-6 text-muted mb-4">
            Daftar semua pengaduan yang telah masuk ke sistem
          </p>

          {complaints.length === 0 ? (
            <div className="card border-0 bg-body-secondary">
              <div className="card-body p-5 text-center">
                <i
                  className="bi bi-inbox text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h4 className="mt-3 text-muted">Belum Ada Pengaduan</h4>
                <p className="text-muted">
                  Belum ada pengaduan yang masuk ke sistem
                </p>
                <Link to="/complaints/new" className="btn btn-info">
                  Buat Pengaduan Pertama
                </Link>
              </div>
            </div>
          ) : (
            <div className="row">
              {complaints.map((complaint, index) => (
                <div key={complaint.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card border-0 bg-body-secondary h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="badge bg-info text-white">
                          #{index + 1}
                        </span>
                        <span className="badge bg-warning text-dark">
                          {complaint.status}
                        </span>
                      </div>

                      <h6 className="card-title text-info mb-2">
                        Kategori: {complaint.category}
                      </h6>

                      <p className="card-text text-muted small mb-3">
                        {complaint.description.length > 100
                          ? complaint.description.substring(0, 100) + "..."
                          : complaint.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {formatDate(complaint.date)}
                        </small>
                        {/* <small className="text-muted font-monospace">
                          {complaint.id}
                        </small> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-info me-2">
              <i className="bi bi-house me-2"></i>Kembali ke Beranda
            </Link>
            <Link to="/complaints/new" className="btn btn-info">
              <i className="bi bi-plus-circle me-2"></i>Buat Pengaduan Baru
            </Link>
          </div>
        </div>
      </div>

      <SecurityAlert />
    </main>
  );
}
