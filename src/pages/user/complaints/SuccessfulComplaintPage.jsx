import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SecurityAlert from "../../../components/SecurityAlert";

export default function SuccessfulComplaintPage() {
  const location = useLocation();
  const [complaintId, setComplaintId] = useState("");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!complaintId) return;
    navigator.clipboard
      .writeText(complaintId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch((error) => console.error("Gagal menyalin: ", error));
  }

  useEffect(() => {
    const id =
      location.state?.complaintId || localStorage.getItem("lastComplaintId");
    if (id) {
      setComplaintId(id);
      localStorage.removeItem("lastComplaintId"); //hapus setelah dipakai
    }
  }, []);

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          <div className="card border-0 bg-body-secondary mt-4">
            <div className="card-body p-4 text-center">
              <i
                className="bi bi-check-circle-fill text-success mb-3"
                style={{ fontSize: "3.5rem" }}
              ></i>
              <h3 className="fw-bold text-success mb-3 fs-4">
                Pengaduan Berhasil Terkirim
              </h3>
              <p className="text-muted mb-4 fs-6">
                Terima kasih telah mempercayai sistem pengaduan kami.
              </p>

              <div className="alert alert-light border border-info rounded-3 mb-4">
                <h5 className="fw-semibold mb-3 text-info fs-5">
                  Kode Pengaduan Anda
                </h5>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control text-center fw-bold font-monospace fs-4"
                    value={complaintId || ""}
                    readOnly
                  />
                  <button
                    className="btn btn-outline-info"
                    onClick={handleCopy}
                    disabled={!complaintId}
                  >
                    <i className="bi bi-clipboard me-2"></i>
                    {copied ? "Disalin" : "Salin"}
                  </button>
                </div>
                <p className="fw-medium text-body mb-2">
                  <i className="bi bi-exclamation-circle text-info me-2"></i>
                  Penting: Simpan kode ini dengan aman!
                </p>
                <p className="small text-muted mb-0">
                  Tanpa kode tersebut, Anda tidak akan dapat memeriksa status
                  laporan atau berkomunikasi lebih lanjut.
                </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-3">
                  <Link
                    to="/user/complaints/check"
                    className="btn btn-outline-info btn-lg px-4 fw-medium"
                  >
                    <i className="bi bi-search me-2"></i>Cek Pengaduan
                  </Link>
                  <Link
                    to="/user/home"
                    className="btn btn-info btn-lg px-4 fw-medium"
                  >
                    <i className="bi bi-house me-2"></i>Beranda
                  </Link>
                </div>
              </div>

              <p className="text-muted mb-4 fs-6">
                Laporan sudah kami terima dan akan ditindaklanjuti segera.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SecurityAlert />
    </main>
  );
}
