import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "../../../utils/api";

export default function ConfirmationPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();

  // State untuk mengelola semua input pada form konfirmasi
  const [formData, setFormData] = useState({
    status: "resolved",
    penindak: "",
    tanggalTindakan: new Date().toISOString().split("T")[0],
    catatan: "",
  });

  // Handler untuk memperbarui state saat input berubah
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handler saat form konfirmasi disubmit
  const handleConfirmationSubmit = async (e) => {
    e.preventDefault();

    // Gabungkan detail dari form menjadi satu teks resolusi
    const resolutionText = `
      Ditindak oleh: ${formData.penindak}
      Tanggal: ${formData.tanggalTindakan}
      Catatan Akhir: ${formData.catatan}
    `.trim();

    if (
      window.confirm("Apakah Anda yakin ingin menyelesaikan pengaduan ini?")
    ) {
      try {
        await api.updateComplaintStatus(complaintId, {
          status: "resolved",
          resolution: resolutionText,
        });
        alert("Pengaduan berhasil diselesaikan!");
        // Arahkan pengguna kembali ke halaman daftar dengan tab Selesai aktif
        navigate("/admin/complaints#resolved");
      } catch (err) {
        alert("Gagal menyimpan konfirmasi.");
        console.error(err);
      }
    }
  };

  return (
    <div className="container py-4">
      <ul className="nav nav-tabs nav-fill mb-3" id="myTab" role="tablist">
        {/* ... Nav tabs ... */}
      </ul>

      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="konfirmasi-pane">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Formulir Konfirmasi Tindakan</h5>
            </div>
            {/* Menggunakan onSubmit untuk memanggil fungsi handleConfirmationSubmit */}
            <form onSubmit={handleConfirmationSubmit} id="konfirmasi-form">
              <div className="card-body">
                {/* Status Akhir (dibuat disabled karena selalu 'Selesai' dari halaman ini) */}
                <label className="form-label">Status Akhir</label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-tag-fill"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value="Selesai (Resolved)"
                    disabled
                  />
                </div>

                {/* Pihak Penindak (terhubung dengan state) */}
                <label className="form-label">Pihak Penindak</label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-person-gear"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="penindak"
                    placeholder="Contoh: Guru BK, Wali Kelas"
                    required
                    value={formData.penindak}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Tanggal Tindakan (terhubung dengan state) */}
                <label className="form-label">Tanggal Tindakan</label>
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <i className="bi bi-calendar-event"></i>
                  </span>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggalTindakan"
                    required
                    value={formData.tanggalTindakan}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Catatan Tindakan (terhubung dengan state) */}
                <label htmlFor="catatan" className="form-label">
                  Rangkuman / Catatan Tindakan
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="bi bi-journal-text"></i>
                  </span>
                  <textarea
                    className="form-control"
                    id="catatan"
                    rows="4"
                    placeholder="Jelaskan secara singkat tindakan yang telah dilakukan..."
                    required
                    value={formData.catatan}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              <div className="card-footer bg-body text-end">
                {/* Tombol Batal untuk kembali ke halaman sebelumnya */}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary me-2"
                >
                  <i className="bi bi-x-lg me-1"></i> Batal
                </button>
                <button
                  type="submit"
                  form="konfirmasi-form"
                  className="btn btn-primary"
                >
                  <i className="bi bi-check2-circle me-1"></i> Simpan Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ... Tab Catatan Internal ... */}
      </div>
    </div>
  );
}
