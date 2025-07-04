import React from "react";
import Navbar from "../components/Navbar";

export default function ComplaintCheckPage({ onToggleTheme }) {
	return (
		<>
			<Navbar onToggleTheme={onToggleTheme} />
			<main className="container my-5">
				<div className="row justify-content-center">
					<div className="col-lg-8 text-start">
						<h1
							className="display-6 fw-bold mb-3 text-info"
							data-lang-id="Cek Pengaduan Anda">
							Cek Pengaduan Anda
						</h1>
						<p
							className="fs-6 mb-5 fw-normal lh-lg"
							data-lang-id="Masukkan kode pengaduan untuk melihat perkembangan laporan Anda">
							Masukkan kode pengaduan untuk melihat perkembangan laporan Anda.
						</p>

						<div className="card border-0 bg-body-secondary mt-4">
							<div className="card-body p-5 text-center">
								<div className="mb-4">
									<i
										className="bi bi-search-heart text-info"
										style={{ fontSize: "3.5rem" }}></i>
								</div>

								<h3
									className="card-title mb-4 fs-4 fw-bold text-info"
									data-lang-id="Masukkan Kode Pengaduan">
									Masukkan Kode Pengaduan
								</h3>

								<form action="HalamanDetailPengaduan.html" method="GET">
									<div className="mb-5">
										<label
											htmlFor="kodePengaduan"
											className="form-label fw-semibold text-body mb-3 fs-5">
											Kode Pengaduan
										</label>
										<input
											type="text"
											className="form-control form-control-lg text-center fw-medium"
											id="kodePengaduan"
											name="kode"
											placeholder="0000 0000 0000 0000"
											maxLength="19"
											style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}
											required
										/>
										<div className="form-text mt-3">
											<p className="text-body fw-medium mb-0">
												Masukkan 16 digit kode pengaduan yang Anda terima
											</p>
										</div>
									</div>

									<div className="row justify-content-center mt-5">
										<div className="col-md-6">
											<button
												type="submit"
												className="btn btn-info btn-lg w-100 py-3 fw-semibold rounded-3 shadow-sm">
												<i className="bi bi-search me-2 fs-5"></i>Cari Pengaduan
											</button>
										</div>
									</div>

									<div className="text-center mt-4">
										<a
											href="#"
											className="small text-decoration-none text-info fw-medium">
											<i className="bi bi-question-circle me-1"></i>Lupa kode
											pengaduan?
										</a>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>

				<div className="d-flex justify-content-center mt-4">
					<div className="alert alert-success alert-success-custom d-flex align-items-center">
						<div className="small">
							<i className="bi bi-shield-fill-check me-1 shield-icon"></i>
							<strong data-lang-id="Semua komunikasi bersifat anonim dan dienkripsi">
								Semua komunikasi bersifat anonim dan dienkripsi{" "}
							</strong>
							,
							<a
								href="#"
								className="text-decoration-underline link-custom"
								data-lang-id="Pelajari lebih lanjut tentang anonimitas">
								Pelajari lebih lanjut tentang anonimitas
							</a>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
