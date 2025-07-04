import React from "react";

export default function ComplaintDetailPage() {
	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-lg-8 text-start">
					{/* <!-- Judul halaman --> */}
					<h1
						className="display-5 fw-bold mb-3 text-info"
						data-lang-id="Detail Pengaduan">
						Detail Pengaduan
					</h1>
					<p
						className="fs-6 text-muted mb-4 fw-normal lh-lg"
						data-lang-id="Pantau perkembangan pengaduan Anda di sini">
						Pantau perkembangan pengaduan Anda di sini.
					</p>

					{/* <!-- Card detail pengaduan --> */}
					<div className="card border-0 bg-body-secondary mt-4">
						<div className="card-body p-4">
							{/* <!-- Header card dengan nomor pengaduan dan status --> */}
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h3 className="card-title fs-4 fw-semibold text-info mb-0">
									<i className="bi bi-file-text me-2"></i>Pengaduan #799d7
								</h3>
								<span className="badge bg-warning text-dark fs-6 px-3 py-2">
									<i className="bi bi-clock me-1"></i>Diajukan
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
										Merokok atau Vaping
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
									<p className="mb-0 lh-lg">
										Saya ingin melaporkan adanya kegiatan merokok yang dilakukan
										oleh beberapa siswa di area sekolah, tepatnya di dekat
										toilet belakang dan parkiran sepeda. Kejadian ini saya lihat
										berlangsung beberapa kali pada jam istirahat maupun setelah
										jam pulang sekolah.
									</p>
								</div>
							</div>

							{/* <!-- Bukti pengaduan --> */}
							<div className="mb-4">
								<label className="form-label fw-semibold text-dark mb-3 fs-6">
									<i className="bi bi-camera text-info me-2"></i>Bukti Pengaduan
									(1)
								</label>
								<div className="card">
									<div className="card-body p-3">
										<div className="d-flex align-items-center">
											<img
												src="https://via.placeholder.com/80x80/e9ecef/6c757d?text=IMG"
												alt="Bukti Pengaduan"
												className="me-3 rounded"
												style={{
													width: "80px",
													height: "80px",
													objectFit: "cover",
												}}
											/>
											<div className="flex-grow-1">
												<h6 className="fw-semibold mb-1">bukti-merokok.png</h6>
												<p className="text-muted small mb-2">Ukuran: 2.5 MB</p>
												<a href="#" className="btn btn-sm btn-outline-info">
													<i className="bi bi-download me-1"></i>Unduh
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* <!-- Status pengaduan --> */}
							<div className="alert alert-info border-0 mb-4">
								<div className="d-flex align-items-start">
									<i className="bi bi-info-circle text-info me-3 mt-1"></i>
									<div>
										<h6 className="fw-semibold mb-2">Status Pengaduan</h6>
										<p className="mb-0 small">
											Pengaduan Anda sedang dalam proses review. Kami akan
											memberikan update melalui sistem ini.
										</p>
									</div>
								</div>
							</div>

							{/* <!-- Timestamp pengaduan --> */}
							<div className="d-flex justify-content-between align-items-center pt-3 border-top">
								<small className="text-muted">
									<i className="bi bi-calendar me-1"></i>Dibuat: 28 Juni 2025,
									15:04
								</small>
								<small className="text-muted">
									<i className="bi bi-clock me-1"></i>Terakhir diubah: 28 Juni
									2025, 15:04
								</small>
							</div>

							{/* <!-- Tombol navigasi --> */}
							<div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
								<a
									href="HalamanBeranda.html"
									className="btn btn-outline-info btn-lg px-4 fw-medium">
									<i className="bi bi-house me-2"></i>Kembali ke Beranda
								</a>
								<a
									href="HalamanCekPengaduan.html"
									className="btn btn-info btn-lg px-4 fw-medium">
									<i className="bi bi-search me-2"></i>Cek Pengaduan Lain
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!-- Alert keamanan untuk menunjukkan anonimitas --> */}
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
	);
}
