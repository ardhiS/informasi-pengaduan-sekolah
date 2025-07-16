import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OffenseCategory from "../../components/OffenseCategory";
import SecurityAlert from "../../components/SecurityAlert";
import useInput from "../../hooks/useInput";
import useFormSubmit from "../../hooks/useFormSubmit";
import useComplaintFiles from "../../hooks/useComplaintFiles";
import useComplaintFormState from "../../hooks/useComplaintFormState";
import { generateComplaintId, validateComplaintForm } from "../../utils";

export default function ComplaintForm() {
  // Hook untuk navigasi halaman
  const navigate = useNavigate();
  const categories = [
    "intimidasi",
    "bolos",
    "perpeloncoan",
    "merokok",
    "merusak-fasilitas-sekolah",
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  function handleCustomCategoryChange(e) {
    setCustomCategory(e.target.value);
    setSelectedCategory("lainnya");
  }

  // State untuk menyimpan deskripsi pengaduan menggunakan custom hook
  const [description, onDescriptionChange] = useInput("");
  // State untuk menangani loading dan submit form menggunakan custom hook
  const [loading, handleSubmit] = useFormSubmit();
  // state untuk menangani Upload file menggunakan custom hook
  const { selectedFiles, handleFileChange, setSelectedFiles } =
    useComplaintFiles();
  // state untuk menangani form notifikasi error dan aggrement check box menggunakan custom hook
  const { formErrors, setFormErrors, agreement, setAgreement } =
    useComplaintFormState();

  // Handler ketika form disubmit
  const onSubmit = async (event) => {
    event.preventDefault();
    // Validasi form pengaduan
    const validation = validateComplaintForm({
      category:
        selectedCategory === "lainnya" ? customCategory : selectedCategory,
      description,
    });

    // Jika ada error, tampilkan pesan error
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Reset error state
    setFormErrors({});

    // Proses submit form
    await handleSubmit(async () => {
      // Generate ID unik untuk pengaduan
      const complaintId = generateComplaintId();

      // Siapkan data pengaduan
      const complaintData = {
        id: complaintId,
        category:
          selectedCategory === "lainnya" ? customCategory : selectedCategory,
        description,
        date: new Date().toISOString(),
        status: "Diajukan",
      };

      // Ambil data pengaduan yang sudah ada dari localStorage
      const existingComplaints = JSON.parse(
        localStorage.getItem("complaints") || "[]"
      );
      // Tambahkan pengaduan baru
      existingComplaints.push(complaintData);
      // Simpan kembali ke localStorage
      localStorage.setItem("complaints", JSON.stringify(existingComplaints));
      localStorage.setItem("currentComplaintId", complaintId);

      // Reset semua field form
      setSelectedCategory("");
      setCustomCategory("");
      onDescriptionChange({ target: { value: "" } });
      setSelectedFiles([]);

      // Delay sebelum redirect ke halaman sukses
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/complaints/success");
    });
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 text-start">
          {/* <!-- Judul halaman --> */}
          <h1
            className="display-5 fw-bold mb-3 text-info"
            data-lang-id="Buat Pengaduan Baru"
          >
            Buat Pengaduan Baru
          </h1>

          {/* <!-- Deskripsi --> */}
          <p className="fs-6 text-muted mb-4 fw-normal lh-lg">
            Kami menghargai setiap pengaduan yang masuk dan akan menanganinya
            secara profesional dan rahasia.
          </p>

          <div className="card border-0 bg-body-secondary mt-4 fade-in">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 fs-4 fw-semibold text-info">
                Form Pengaduan
              </h3>

              <form onSubmit={onSubmit}>
                {/* <!-- Kategori --> */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-body mb-3">
                    <i className="bi bi-list-ul text-info me-2"></i>
                    Pilih Kategori Pengaduan
                  </label>
                  {/* <input
										type="text"
										className="form-control form-control-lg"
										value="Merokok atau Vaping"
										readOnly
										style={{ backgroundColor: "#f8f9fa" }}
									/> */}
                  <div className="d-flex flex-wrap justify-content-between row-gap-3">
                    {categories.map((category) => {
                      return (
                        <OffenseCategory
                          category={category}
                          isChecked={selectedCategory === category}
                          onSelectedCategory={() =>
                            setSelectedCategory(category)
                          }
                          key={category}
                        />
                      );
                    })}
                    <div className="d-flex w-100 gap-2">
                      <input
                        type="radio"
                        className={"btn-check"}
                        name="category"
                        id={"lainnya"}
                        value={"lainnya"}
                        checked={selectedCategory === "lainnya"}
                        onChange={() => setSelectedCategory("lainnya")}
                      />
                      <label
                        htmlFor={"lainnya"}
                        className={`btn btn-outline-secondary radio-card`}
                      >
                        Lainnya
                      </label>

                      {selectedCategory === "lainnya" && (
                        <input
                          type="text"
                          className="form-control"
                          value={customCategory}
                          onChange={handleCustomCategoryChange}
                          placeholder="Masukkan kategori lainnya"
                        />
                      )}
                    </div>
                  </div>
                  {formErrors.category && (
                    <div className="text-danger mt-2 small">
                      {formErrors.category}
                    </div>
                  )}
                </div>

                {/* <!-- Deskripsi --> */}
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

                {/* <!-- Upload File --> */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-body mb-3">
                    <i className="bi bi-camera text-info me-2"></i>
                    Bukti Foto (Opsional)
                  </label>
                  <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
                    <i
                      className="bi bi-cloud-upload text-dark mb-3"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                    <h6 className="fw-medium text-dark mb-2">
                      Upload Foto Bukti
                    </h6>
                    <p className="text-dark small mb-3">
                      Pilih file dari komputer Anda
                    </p>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      id="fileUpload"
                      onChange={handleFileChange}
                    />
                    <div className="mt-3">
                      <small className="text-dark">
                        Maksimal 5 foto • Format: JPG, PNG, GIF • Ukuran
                        maksimal 10MB per file
                      </small>
                    </div>
                    {/* File Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 text-start text-dark">
                        <h6>File yang dipilih:</h6>
                        <ul className="small">
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

                {/* <!-- Agreement --> */}
                <div className="card border-0 bg-light mb-4">
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
                        className="form-check-label fw-medium text-dark"
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

                {/* <!-- Submit Button --> */}
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

                {/* <!-- Back Button --> */}
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                  <Link
                    to={"/"}
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

      {/* <!-- Security Alert --> */}
      <SecurityAlert />
    </main>
  );
}
