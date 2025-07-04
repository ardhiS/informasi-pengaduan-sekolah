import React from "react";

export default function ComplaintForm() {
	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-lg-8 text-start">
					{/* <!-- Judul halaman --> */}
					<h1
						className="display-5 fw-bold mb-3 text-info"
						data-lang-id="Buat Pengaduan Baru">
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

							<form action="HalamanPengaduanSukses.html" method="POST">
								{/* <!-- Kategori --> */}
								<div className="mb-4">
									<label className="form-label fw-semibold text-dark mb-3">
										<i className="bi bi-list-ul text-info me-2"></i>
										Kategori Pengaduan
									</label>
									<input
										type="text"
										className="form-control form-control-lg"
										value="Merokok atau Vaping"
										readOnly
										style={{ backgroundColor: "#f8f9fa" }}
									/>
								</div>

								{/* <!-- Deskripsi --> */}
								<div className="mb-4">
									<label
										htmlFor="description"
										className="form-label fw-semibold text-dark mb-3">
										<i className="bi bi-chat-text text-info me-2"></i>
										Detail Pengaduan
									</label>
									<textarea
										className="form-control form-control-lg"
										id="description"
										name="description"
										rows="6"
										placeholder="Ceritakan detail pengaduan Anda dengan jelas..."
										required></textarea>
									<div className="form-text mt-2">
										<small className="text-muted">
											Semakin detail informasi, semakin mudah kami
											menindaklanjuti
										</small>
									</div>
								</div>

								{/* <!-- Upload File --> */}
								<div className="mb-4">
									<label className="form-label fw-semibold text-dark mb-3">
										<i className="bi bi-camera text-info me-2"></i>
										Bukti Foto (Opsional)
									</label>
									<div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
										<i
											className="bi bi-cloud-upload text-muted mb-3"
											style={{ fontSize: "2.5rem" }}></i>
										<h6 className="fw-medium text-dark mb-2">
											Upload Foto Bukti
										</h6>
										<p className="text-muted small mb-3">
											Pilih file dari komputer Anda
										</p>
										<input
											type="file"
											className="form-control"
											multiple
											accept="image/*"
											id="fileUpload"
										/>
										<div className="mt-3">
											<small className="text-muted">
												Maksimal 5 foto • Format: JPG, PNG, GIF • Ukuran
												maksimal 10MB per file
											</small>
										</div>
									</div>

									{/* <!-- File Preview Area --> */}
									<div
										id="filePreview"
										className="mt-3"
										style={{ display: "none" }}>
										<h6>File yang dipilih:</h6>
										<div id="fileList"></div>
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
												required
											/>
											<label
												className="form-check-label fw-medium"
												htmlFor="agreement">
												Saya memahami bahwa penyalahgunaan saluran pengaduan
												dapat menghambat penanganan laporan yang benar-benar
												penting.
											</label>
										</div>
									</div>
								</div>

								{/* <!-- Submit Button --> */}
								<div className="d-grid mb-4">
									<button
										type="submit"
										className="btn btn-info btn-lg fw-medium"
										id="submitBtn">
										<i className="bi bi-send me-2"></i>
										Kirim Pengaduan
									</button>
								</div>

								{/* <!-- Back Button --> */}
								<div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
									<a
										href="HalamanPilihKategori.html"
										className="btn btn-outline-info btn-lg px-4 fw-medium">
										<i className="bi bi-arrow-left me-2"></i>
										Kembali
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* <!-- Security Alert --> */}
			<div className="d-flex justify-content-center mt-4">
				<div className="alert alert-success alert-success-custom d-flex align-items-center">
					<div className="small">
						<i className="bi bi-shield-fill-check me-1 shield-icon"></i>
						<strong data-lang-id="Semua komunikasi bersifat anonim dan dienkripsi">
							Semua komunikasi bersifat anonim dan dienkripsi
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
	);
}
