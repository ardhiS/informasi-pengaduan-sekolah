import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OffenseCategory from "../../../components/OffenseCategory";
import SecurityAlert from "../../../components/SecurityAlert";
import useInput from "../../../hooks/useInput";
import useFormSubmit from "../../../hooks/useFormSubmit";
import useComplaintFiles from "../../../hooks/useComplaintFiles";
import useComplaintFormState from "../../../hooks/useComplaintFormState";
import { createComplaint } from "../../../utils/api";
import { validateComplaintForm } from "../../../utils";

export default function ComplaintForm() {
  const navigate = useNavigate();
  const categories = ["akademik", "fasilitas", "bullying", "lainnya"];

  const [title, onTitleChange] = useInput("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, onDescriptionChange] = useInput("");
  const [loading, handleSubmit] = useFormSubmit();
  const { selectedFiles, handleFileChange, setSelectedFiles } =
    useComplaintFiles();
  const { formErrors, setFormErrors, agreement, setAgreement } =
    useComplaintFormState();
  const [apiError, setApiError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const categoryValue = selectedCategory;

    const validation = validateComplaintForm({
      title,
      category: categoryValue,
      description,
      agreement,
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});

    await handleSubmit(async () => {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", categoryValue);
      formData.append("priority", "medium");

      selectedFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      const result = await createComplaint(formData);

      if (result.status === "success") {
        const complaintId = result.data?.id;

        if (complaintId) {
          navigate("/user/complaints/succeed", {
            state: { complaintId },
          });
          localStorage.setItem("lastComplaintId", complaintId);
        } else {
          console.error("ID pengaduan tidak ditemukan di response backend.");
          setApiError("Pengaduan berhasil dikirim, tapi ID tidak ditemukan.");
        }

        // Reset formulir tetap dilakukan
        onTitleChange({ target: { value: "" } });
        setSelectedCategory("");
        onDescriptionChange({ target: { value: "" } });
        setSelectedFiles([]);
        setAgreement(false);
      } else {
        setApiError(
          result.message || "Terjadi kesalahan saat mengirim pengaduan."
        );
      }
    });
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          <h1 className="display-5 fw-bold mb-3 text-info">
            Buat Pengaduan Baru
          </h1>
          <p className="fs-6 text-muted mb-4 fw-normal lh-lg">
            Kami menghargai setiap pengaduan yang masuk dan akan menanganinya
            secara profesional dan rahasia.
          </p>
          <div className="card border-0 bg-body-secondary mt-4 fade-in">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 fs-4 fw-semibold text-info">
                Form Pengaduan
              </h3>

              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-body mb-3">
                    <i className="bi bi-list-ul text-info me-2"></i>
                    Pilih Kategori Pengaduan
                  </label>
                  <div className="d-flex flex-wrap justify-content-between row-gap-3">
                    {categories.map((category) => (
                      <OffenseCategory
                        category={category}
                        isChecked={selectedCategory === category}
                        onSelectedCategory={() => setSelectedCategory(category)}
                        key={category}
                      />
                    ))}
                  </div>
                  {formErrors.category && (
                    <div className="text-danger mt-2 small">
                      {formErrors.category}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="form-label fw-semibold text-body mb-3"
                  >
                    <i className="bi bi-pencil-square text-info me-2"></i>
                    Judul Pengaduan
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="title"
                    name="title"
                    value={title}
                    onChange={onTitleChange}
                    placeholder="Tuliskan judul singkat pengaduan Anda..."
                    required
                  />
                  {formErrors.title && (
                    <div className="text-danger mt-2 small">
                      {formErrors.title}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="form-label fw-semibold text-body mb-3"
                  >
                    <i className="bi bi-chat-text text-info me-2"></i>
                    Detail Pengaduan
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    id="description"
                    name="description"
                    rows="6"
                    value={description}
                    onChange={onDescriptionChange}
                    placeholder="Ceritakan detail pengaduan Anda dengan jelas..."
                    required
                  ></textarea>
                  <div className="form-text mt-2">
                    <small className="text-muted">
                      Semakin detail informasi, semakin mudah kami
                      menindaklanjuti
                    </small>
                  </div>
                  {formErrors.description && (
                    <div className="text-danger mt-2 small">
                      {formErrors.description}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-body mb-3">
                    <i className="bi bi-camera text-info me-2"></i>
                    Bukti Foto (Opsional)
                  </label>
                  <div className="border border-2 border-dashed rounded-3 p-4 text-center">
                    <i
                      className="bi bi-cloud-upload mb-3"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                    <h6 className="fw-medium mb-2">Upload Foto Bukti</h6>
                    <p className="small mb-3">Pilih file dari komputer Anda</p>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      id="fileUpload"
                      onChange={handleFileChange}
                    />
                    <div className="mt-3">
                      <small className="">
                        Maksimal 5 foto • Format: JPG, PNG, GIF • Ukuran
                        maksimal 10MB per file
                      </small>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 text-start ">
                        <h6>File yang dipilih:</h6>
                        <ul className="small list-unstyled">
                          {selectedFiles.map((file, index) => (
                            <li className="list-group-item" key={index}>
                              {file.name}
                              <div className="mt-2">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`preview-${index}`}
                                  style={{
                                    maxWidth: "200px",
                                    height: "auto",
                                    borderRadius: "8px",
                                    marginTop: "8px",
                                  }}
                                  onLoad={(e) =>
                                    URL.revokeObjectURL(e.target.src)
                                  }
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card border-0 mb-4">
                  <div className="card-body p-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreement"
                        name="agreement"
                        checked={agreement}
                        onChange={(e) => setAgreement(e.target.checked)}
                        required
                      />
                      <label
                        className="form-check-label fw-medium "
                        htmlFor="agreement"
                      >
                        Saya memahami bahwa penyalahgunaan saluran pengaduan
                        dapat menghambat penanganan laporan yang benar-benar
                        penting.
                      </label>
                    </div>
                    {formErrors.agreement && (
                      <div className="text-danger mt-2 small">
                        {formErrors.agreement}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn btn-info btn-lg fw-medium"
                    disabled={loading}
                  >
                    <i className="bi bi-send me-2"></i>
                    {loading ? "Mengirim..." : "Kirim Pengaduan"}
                  </button>
                </div>

                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                  <Link
                    to={"/user/home"}
                    className="btn btn-outline-info btn-lg px-4 fw-medium"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Kembali
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SecurityAlert />
    </main>
  );
}
