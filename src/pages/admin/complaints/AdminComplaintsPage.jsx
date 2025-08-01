import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import * as api from "../../../utils/api";

export default function AdminComplaintsPage() {
  const location = useLocation();
  const [complaints, setComplaints] = useState({
    pending: [],
    in_progress: [],
    resolved: [],
    rejected: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan query pencarian

  const fetchAllComplaints = useCallback(async () => {
    // Tidak mengatur isLoading di sini agar tidak ada flicker saat re-fetch
    try {
      const [pendingRes, inProgressRes, resolvedRes, rejectedRes] =
        await Promise.all([
          api.getComplaints({ status: "pending_approval" }),
          api.getComplaints({ status: "in_progress" }),
          api.getComplaints({ status: "resolved" }),
          api.getComplaints({ status: "rejected" }),
        ]);

      setComplaints({
        pending: pendingRes.data.complaints || [],
        in_progress: inProgressRes.data.complaints || [],
        resolved: resolvedRes.data.complaints || [],
        rejected: rejectedRes.data.complaints || [],
      });
    } catch (err) {
      setError("Gagal memuat data pengaduan.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchAllComplaints();
    window.addEventListener("focus", fetchAllComplaints);
    return () => {
      window.removeEventListener("focus", fetchAllComplaints);
    };
  }, [fetchAllComplaints]);

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.substring(1);
      const tabButton = document.querySelector(
        `button[data-bs-target="#pills-${targetId}"]`
      );
      if (tabButton) {
        tabButton.click();
      }
    }
  }, [location.hash]);

  const handleDelete = async (complaintId, statusKey) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus pengaduan ini secara permanen? Tindakan ini tidak dapat diurungkan.`
      )
    ) {
      return;
    }

    try {
      await api.deleteComplaint(complaintId);
      setComplaints((prevComplaints) => ({
        ...prevComplaints,
        [statusKey]: prevComplaints[statusKey].filter(
          (c) => c.id !== complaintId
        ),
      }));
    } catch (err) {
      setError("Gagal menghapus pengaduan. Silakan coba lagi.");
      console.error(err);
    }
  };

  /**
   * Merender daftar pengaduan, sekarang dengan logika untuk pesan saat hasil pencarian kosong.
   */
  const renderComplaintList = (list, statusKey, statusLabel) => {
    if (list.length === 0) {
      return (
        <div className="text-center p-5 bg-body-tertiary rounded shadow-sm">
          <i className="bi bi-search fs-1 text-muted"></i>
          <h5 className="mt-3">
            {searchTerm ? "Pencarian Tidak Ditemukan" : "Tidak Ada Data"}
          </h5>
          <p className="text-muted">
            {searchTerm
              ? `Tidak ada pengaduan yang cocok dengan kata kunci "${searchTerm}".`
              : `Tidak ada pengaduan dengan status "${statusLabel}" saat ini.`}
          </p>
        </div>
      );
    }
    return (
      <div className="list-group">
        {list.map((complaint) => (
          <div
            key={complaint.id}
            className="list-group-item d-flex justify-content-between align-items-center p-0"
          >
            <Link
              to={`/admin/complaint/details/${complaint.id}`}
              className="d-flex align-items-center py-3 ps-3 text-decoration-none text-dark flex-grow-1"
            >
              <div className="icon-circle bg-primary-subtle text-primary">
                <i className="bi bi-bell"></i>
              </div>
              <div className="ms-3 flex-grow-1">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 fw-bold">{complaint.title}</h6>
                </div>
                <small className="text-muted">
                  ID: #{complaint.id.slice(0, 6)}
                </small>
              </div>
              <small className="text-muted me-3">
                {new Date(complaint.created_at).toLocaleDateString("id-ID")}
              </small>
            </Link>
            <button
              className="btn btn-sm btn-outline-danger me-3"
              onClick={() => handleDelete(complaint.id, statusKey)}
              title="Hapus Pengaduan"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Fungsi untuk memfilter daftar pengaduan berdasarkan searchTerm
  const getFilteredComplaints = (list) => {
    if (!searchTerm) {
      return list;
    }
    return list.filter(
      (complaint) =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  if (isLoading) {
    return <div className="text-center py-5">Memuat data...</div>;
  }
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container py-4">
      {/* Input Pencarian */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="🔍 Cari berdasarkan judul atau ID pengaduan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ul className="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
        {/* Nav pills tetap sama */}
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            data-bs-toggle="pill"
            data-bs-target="#pills-pending"
          >
            Baru{" "}
            <span className="badge bg-white text-primary ms-1">
              {complaints.pending.length}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#pills-in_progress"
          >
            Diproses{" "}
            <span className="badge bg-white text-primary ms-1">
              {complaints.in_progress.length}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#pills-resolved"
          >
            Selesai{" "}
            <span className="badge bg-white text-primary ms-1">
              {complaints.resolved.length}
            </span>
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#pills-rejected"
          >
            Ditolak{" "}
            <span className="badge bg-white text-primary ms-1">
              {complaints.rejected.length}
            </span>
          </button>
        </li>
      </ul>

      {/* Konten Tab */}
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-pending"
          role="tabpanel"
        >
          {renderComplaintList(
            getFilteredComplaints(complaints.pending),
            "pending",
            "Baru"
          )}
        </div>
        <div className="tab-pane fade" id="pills-in_progress" role="tabpanel">
          {renderComplaintList(
            getFilteredComplaints(complaints.in_progress),
            "in_progress",
            "Diproses"
          )}
        </div>
        <div className="tab-pane fade" id="pills-resolved" role="tabpanel">
          {renderComplaintList(
            getFilteredComplaints(complaints.resolved),
            "resolved",
            "Selesai"
          )}
        </div>
        <div className="tab-pane fade" id="pills-rejected" role="tabpanel">
          {renderComplaintList(
            getFilteredComplaints(complaints.rejected),
            "rejected",
            "Ditolak"
          )}
        </div>
      </div>
    </div>
  );
}
