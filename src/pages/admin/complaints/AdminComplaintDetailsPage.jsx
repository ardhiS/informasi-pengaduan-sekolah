import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as api from "../../../utils/api";

export default function AdminComplaintDetailsPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!complaintId) return;
      setIsLoading(true);
      try {
        const response = await api.getComplaintDetails(complaintId);
        if (response.status === "success") {
          setComplaint(response.data.complaint);
        } else {
          throw new Error(response.message || "Gagal mengambil data.");
        }
      } catch (err) {
        setError("Gagal memuat detail pengaduan.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [complaintId]);

  const handleReject = async () => {
    if (window.confirm("Apakah Anda yakin ingin menolak pengaduan ini?")) {
      try {
        await api.updateComplaintStatus(complaintId, {
          status: "rejected",
          resolution: "Ditolak oleh Admin setelah peninjauan.",
        });
        alert("Pengaduan berhasil ditolak.");
        navigate("/admin/complaints#rejected");
      } catch (err) {
        alert("Gagal menolak pengaduan.");
        console.error(err);
      }
    }
  };

  const handleSetInProgress = async () => {
    if (
      window.confirm(
        'Ubah status menjadi "Diproses"? Tim akan mulai menangani pengaduan ini.'
      )
    ) {
      try {
        await api.updateComplaintStatus(complaintId, { status: "in_progress" });
        alert('Status pengaduan berhasil diubah menjadi "Diproses".');
        navigate("/admin/complaints#in_progress");
      } catch (err) {
        alert("Gagal mengubah status pengaduan.");
      }
    }
  };

  if (isLoading)
    return <div className="text-center py-5">Memuat detail...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!complaint)
    return <div className="text-center py-5">Data tidak ditemukan.</div>;

  return (
    <div className="container py-4">
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="detail-tab-pane">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Pengaduan #{complaint.id.slice(0, 6)}</h5>
              <span className="badge bg-primary rounded-pill">
                {complaint.status}
              </span>
            </div>
            <div className="card-body">
              <h6 className="text-muted">PELAPOR</h6>
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-person-circle fs-2 text-secondary me-2"></i>
                <div>
                  <strong>{complaint.reporter?.name || "Anonim"}</strong>
                  <div className="text-muted small">
                    {complaint.reporter
                      ? `ID: ${complaint.reporter.id.slice(0, 8)}`
                      : "Identitas disembunyikan"}
                  </div>
                </div>
              </div>
              <h6 className="text-muted">DETAIL</h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Tanggal</span>
                  <strong>
                    {new Date(complaint.created_at).toLocaleString("id-ID")}
                  </strong>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Kategori</span>
                  <strong>{complaint.category}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span className="text-muted">Prioritas</span>
                  <strong>{complaint.priority}</strong>
                </li>
              </ul>
              <h6 className="text-muted mt-4">ISI PENGADUAN</h6>
              <p className="fst-italic bg-light p-3 rounded">
                {complaint.description}
              </p>

              {/* =======================================================
                DITAMBAHKAN: Menampilkan catatan resolusi jika ada
                =======================================================
              */}
              {(complaint.status === "resolved" ||
                complaint.status === "rejected") &&
                complaint.resolution && (
                  <>
                    <h6 className="text-muted mt-4">CATATAN PENYELESAIAN</h6>
                    <div className="alert alert-info">
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          fontFamily: "inherit",
                          margin: 0,
                        }}
                      >
                        {complaint.resolution}
                      </pre>
                    </div>
                  </>
                )}
            </div>
            <div className="card-footer bg-white d-grid gap-2 d-sm-flex justify-content-sm-end">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleReject}
              >
                <i className="bi bi-x-circle me-2"></i>Tolak
              </button>
              <button
                className="btn btn-warning"
                type="button"
                onClick={handleSetInProgress}
              >
                <i className="bi bi-clock-history me-2"></i>Proses
              </button>
              <Link
                to={`/admin/konfirmasi/${complaintId}`}
                className="btn btn-success"
              >
                <i className="bi bi-check-circle me-2"></i>Konfirmasi Selesai
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
