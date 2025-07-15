import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BsExclamationTriangleFill,
  BsShieldExclamation,
  BsBan,
  BsExclamationCircle,
  BsThreeDots,
  BsArrowLeft,
  BsArrowRight,
  BsShieldFillCheck,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import SecurityAlert from "../../components/SecurityAlert";

// Komponen utama CategoryPage
function CategoriesPage() {
  // Hook untuk navigasi
  // const navigate = useNavigate();
  // // Handler untuk tombol kembali
  // const handleBack = () => {
  // 	navigate("/");
  // };

  return (
    <>
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-start">
            <h1
              className="display-5 fw-bold mb-3 text-info"
              data-lang-id="Pilih Kategori Pengaduan"
            >
              Pilih Kategori Pengaduan
            </h1>
            <p
              className="fs-6 text-muted mb-4 fw-normal lh-lg"
              data-lang-id="Silakan pilih kategori yang paling sesuai dengan pengaduan yang ingin Anda sampaikan"
            >
              Silakan pilih kategori yang paling sesuai dengan pengaduan yang
              ingin Anda sampaikan.
            </p>

            <div className="card border-0 bg-body-tertiary mt-4">
              <div className="card-body p-4">
                <h3
                  className="card-title mb-4 fs-4 fw-semibold text-info"
                  data-lang-id="Kategori Pengaduan"
                >
                  Kategori
                </h3>

                <form>
                  <div className="mb-4">
                    <label className="form-label fw-medium text-body mb-3 fs-6">
                      Pilih Kategori
                    </label>
                    <div className="d-flex flex-column gap-3">
                      <div className="radio-card card border-2 border-secondary-subtle rounded-3 p-3 bg-body">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="kategori"
                          id="bullying"
                          value="bullying"
                          required
                        />
                        <label className="radio-label" htmlFor="bullying">
                          <div className="d-flex align-items-center">
                            <BsExclamationTriangleFill className="text-warning me-3 fs-4" />
                            <div>
                              <div className="fw-semibold text-body">
                                Bullying / Perundungan
                              </div>
                              <small className="text-body-secondary">
                                Intimidasi, ancaman, atau perlakuan tidak
                                menyenangkan
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="radio-card card border-2 border-secondary-subtle rounded-3 p-3 bg-body">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="kategori"
                          id="pelecehan"
                          value="pelecehan"
                          required
                        />
                        <label className="radio-label" htmlFor="pelecehan">
                          <div className="d-flex align-items-center">
                            <BsShieldExclamation className="text-danger me-3 fs-4" />
                            <div>
                              <div className="fw-semibold text-body">
                                Pelecehan
                              </div>
                              <small className="text-body-secondary">
                                Pelecehan seksual atau tindakan tidak pantas
                                lainnya
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="radio-card card border-2 border-secondary-subtle rounded-3 p-3 bg-body">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="kategori"
                          id="merokok"
                          value="merokok"
                          required
                        />
                        <label className="radio-label" htmlFor="merokok">
                          <div className="d-flex align-items-center">
                            <BsBan className="text-danger me-3 fs-4" />
                            <div>
                              <div className="fw-semibold text-body">
                                Merokok atau Vaping
                              </div>
                              <small className="text-body-secondary">
                                Aktivitas merokok atau vaping di area sekolah
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="radio-card card border-2 border-secondary-subtle rounded-3 p-3 bg-body">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="kategori"
                          id="ketidakadilan"
                          value="ketidakadilan"
                          required
                        />
                        <label className="radio-label" htmlFor="ketidakadilan">
                          <div className="d-flex align-items-center">
                            <BsExclamationCircle className="text-primary me-3 fs-4" />
                            <div>
                              <div className="fw-semibold text-body">
                                Ketidakadilan Sistem
                              </div>
                              <small className="text-body-secondary">
                                Perlakuan tidak adil dalam sistem pendidikan
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                      <div className="radio-card card border-2 border-secondary-subtle rounded-3 p-3 bg-body">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="kategori"
                          id="lainnya"
                          value="lainnya"
                          required
                        />
                        <label className="radio-label" htmlFor="lainnya">
                          <div className="d-flex align-items-center">
                            <BsThreeDots className="text-secondary me-3 fs-4" />
                            <div>
                              <div className="fw-semibold text-body">
                                Lainnya
                              </div>
                              <small className="text-body-secondary">
                                Kategori lain yang tidak disebutkan di atas
                              </small>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
                    {/* <button
											type="button"
											onClick={handleBack}
											className="btn btn-outline-info btn-lg px-4 fw-medium">
											<BsArrowLeft className="me-2" />
											Kembali
										</button> */}
                    <Link
                      to={"/"}
                      className="btn btn-outline-info btn-lg px-4 fw-medium"
                    >
                      <BsArrowLeft className="me-2" />
                      Kembali
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-info btn-lg px-4 fw-medium"
                    >
                      <BsArrowRight className="me-2" />
                      Selanjutnya
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Alert keamanan */}
        <SecurityAlert />
      </main>
    </>
  );
}

export default CategoriesPage;
