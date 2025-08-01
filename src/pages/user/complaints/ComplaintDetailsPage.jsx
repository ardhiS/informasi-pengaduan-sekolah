import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SecurityAlert from "../../../components/SecurityAlert";
import { formatDate } from "../../../utils";
import Loading from "../../../components/Loading";
import { getComplaintDetails } from "../../../utils/api";

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function ComplaintDetailPage() {
  const { complaintId } = useParams();
  const [complaintData, setComplaintData] = useState(null);
  console.log("id: ", complaintId);

  useEffect(() => {
    async function fetchComplaintDetails() {
      const complaintDetails = await getComplaintDetails(complaintId);
      console.log("complaint details: ", complaintDetails);
      const {
        id,
        title,
        description,
        category,
        status,
        priority,
        created_at,
        updated_at,
        images,
      } = complaintDetails.data.complaint;
      setComplaintData({
        id,
        title,
        description,
        category,
        status,
        priority,
        createdAt: formatDate(created_at),
        updatedAt: formatDate(updated_at),
        images: images || [],
      });
    }

    fetchComplaintDetails();
  }, [complaintId]);

  if (!complaintData) {
    return <Loading />;
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          {/* <!-- Judul halaman --> */}
          <h1
            className="display-5 fw-bold mb-3 text-info"
            data-lang-id="Detail Pengaduan"
          >
            Detail Pengaduan
          </h1>
          <p
            className="fs-6 text-muted mb-4 fw-normal lh-lg"
            data-lang-id="Pantau perkembangan pengaduan Anda di sini"
          >
            Pantau perkembangan pengaduan Anda di sini.
          </p>

          {/* <!-- Card detail pengaduan --> */}
          <div className="card border-0 bg-body-secondary mt-4">
            <div className="card-body p-4">
              {/* <!-- Header card dengan nomor pengaduan dan status --> */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="card-title fs-4 fw-semibold text-info mb-0">
                  <i className="bi bi-file-text me-2"></i>Pengaduan{" "}
                  {complaintData.id}
                </h3>
                <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                  {complaintData.priority}
                </span>
              </div>

              {/* <!-- Informasi pengirim dan kategori --> */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-dark mb-2 fs-6">
                    <i className="bi bi-person text-info me-2"></i>Identitas
                    Pengirim
                  </label>
                  <p className="fw-medium text-dark mb-0">Anonim</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold text-dark mb-2 fs-6">
                    <i className="bi bi-tag text-info me-2"></i>Kategori
                  </label>
                  <p className="fw-medium text-dark mb-0">
                    {complaintData.category}
                  </p>
                </div>
              </div>

              {/* <!-- Isi pengaduan --> */}
              <div className="mb-4">
                <label className="form-label fw-semibold mb-3 fs-6">
                  <i className="bi bi-chat-text text-info me-2"></i>Isi
                  Pengaduan
                </label>
                <div className="bg-body border rounded-3 p-3">
                  <p className="mb-0 lh-lg">{complaintData.description}</p>
                </div>
              </div>

              {/* <!-- Bukti pengaduan --> */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark mb-3 fs-6">
                  <i className="bi bi-camera text-info me-2"></i>Bukti Pengaduan
                  ({complaintData.images ? complaintData.images.length : 0})
                </label>
                {complaintData.images && complaintData.images.length > 0 ? (
                  complaintData.images.map((image) => {
                    const imageUrl = image.imageUrl.replace(
                      "undefined",
                      "https://happy-corners-return-mysteriously.a276.dcdg.xyz"
                    );
                    return (
                      <div className="card mb-2" key={image.id}>
                        <div className="card-body p-3">
                          <div className="d-flex align-items-center">
                            <img
                              src={imageUrl}
                              alt={image.filename}
                              className="me-3 rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="fw-semibold mb-1">
                                {image.filename}
                              </h6>
                              <p className="text-muted small mb-2">
                                Ukuran: {formatBytes(image.file_size)}
                              </p>
                              <a
                                href={imageUrl}
                                className="btn btn-sm btn-outline-info"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-download me-1"></i>
                                Unduh
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="alert alert-light">
                    Tidak ada bukti yang dilampirkan.
                  </div>
                )}
              </div>

              {/* <!-- Status pengaduan --> */}
              <div className="alert alert-info border-0 mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-info-circle text-info me-3 mt-1"></i>
                  <div>
                    <h6 className="fw-semibold mb-2">Status Pengaduan</h6>
                    <p className="mb-0 small">
                      {complaintData.status === "Diajukan"
                        ? "Pengaduan Anda sedang dalam proses review. Kami akan memberikan update melalui sistem ini."
                        : complaintData.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* <!-- Timestamp pengaduan --> */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <small className="text-muted">
                  <i className="bi bi-calendar me-1"></i>Dibuat:{" "}
                  {complaintData.createdAt}
                </small>
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>Terakhir diubah:{" "}
                  {complaintData.updatedAt}
                </small>
              </div>

              {/* <!-- Tombol navigasi --> */}
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                <Link
                  to={"/user/home"}
                  className="btn btn-outline-info btn-lg px-4 fw-medium"
                >
                  <i className="bi bi-house me-2"></i>Kembali ke Beranda
                </Link>
                <Link
                  to={"/user/complaints/check"}
                  href="HalamanCekPengaduan.html"
                  className="btn btn-info btn-lg px-4 fw-medium"
                >
                  <i className="bi bi-search me-2"></i>Cek Pengaduan Lain
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Alert keamanan untuk menunjukkan anonimitas --> */}
      <SecurityAlert />
    </main>
  );
}
