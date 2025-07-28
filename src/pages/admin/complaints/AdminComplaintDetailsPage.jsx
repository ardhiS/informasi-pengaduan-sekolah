export default function AdminComplaintDetailsPage() {
	return (
		<>
			<div className="container py-4">
				<ul className="nav nav-tabs nav-fill mb-3" id="myTab" role="tablist">
					{/* <!-- TAB DETAIL --> */}
					<li className="nav-item" role="presentation">
						<button
							className="nav-link active"
							id="detail-tab"
							data-bs-toggle="tab"
							data-bs-target="#detail-tab-pane"
							type="button"
							role="tab"
							aria-controls="detail-tab-pane"
							aria-selected="true">
							<i className="bi bi-file-earmark-text me-1"></i> Detail
						</button>
					</li>
					{/* <!-- TAB MEDIA --> */}
					<li className="nav-item" role="presentation">
						<button
							className="nav-link"
							id="media-tab"
							data-bs-toggle="tab"
							data-bs-target="#media-tab-pane"
							type="button"
							role="tab"
							aria-controls="media-tab-pane"
							aria-selected="false">
							<i className="bi bi-image me-1"></i> Media
							<span className="badge bg-danger rounded-pill">2</span>
						</button>
					</li>
					{/* <!-- TAB CATATAN INTERNAL (OPSIONAL) --> */}
					<li className="nav-item" role="presentation">
						<button
							className="nav-link"
							id="catatan-tab"
							data-bs-toggle="tab"
							data-bs-target="#catatan-tab-pane"
							type="button"
							role="tab"
							aria-controls="catatan-tab-pane"
							aria-selected="false">
							<i className="bi bi-pencil-square me-1"></i> Catatan Internal
						</button>
					</li>
				</ul>

				<div className="tab-content" id="myTabContent">
					{/* <!-- KONTEN ATAU ISI DARI TAB DETAIL --> */}
					<div
						className="tab-pane fade show active"
						id="detail-tab-pane"
						role="tabpanel"
						aria-labelledby="detail-tab"
						tabIndex="0">
						<div className="card shadow-sm">
							<div className="card-header bg-white d-flex justify-content-between align-items-center">
								<h5 className="mb-0">Pengaduan #42523</h5>
								<span className="badge bg-primary rounded-pill">Baru</span>
							</div>
							<div className="card-body">
								<h6 className="text-muted">PELAPOR</h6>
								<div className="d-flex align-items-center mb-4">
									<i className="bi bi-person-circle fs-2 text-secondary me-2"></i>
									<div>
										<strong>Anonim</strong>
										<div className="text-muted small">
											Identitas user disembunyikan
										</div>
									</div>
								</div>
								<h6 className="text-muted">DETAIL</h6>
								<ul className="list-group list-group-flush">
									<li className="list-group-item d-flex justify-content-between align-items-center px-0">
										<span className="text-muted">Tanggal</span>
										<strong>19 Jul 2025, 07:00</strong>
									</li>
									<li className="list-group-item d-flex justify-content-between align-items-center px-0">
										<span className="text-muted">Kategori</span>
										<strong>Merokok atau Vaping</strong>
									</li>
									<li className="list-group-item d-flex justify-content-between align-items-center px-0">
										<span className="text-muted">Lokasi</span>
										<strong>Belakang Kantin</strong>
									</li>
								</ul>
								<h6 className="text-muted mt-4">ISI PENGADUAN</h6>
								<p className="fst-italic bg-light p-3 rounded">
									"It is a long established fact that a reader will be
									distracted by the readable content of a page when looking at
									its layout. The point of using Lorem Ipsum is that it has a
									more-or-less normal distribution of letters..."
								</p>
							</div>
							<div className="card-footer bg-white d-grid gap-2 d-sm-flex justify-content-sm-end">
								<button className="btn btn-outline-danger" type="button">
									<i className="bi bi-x-circle me-2"></i>Tolak
								</button>
								<button className="btn btn-warning" type="button">
									<i className="bi bi-clock-history me-2"></i>Pending
								</button>
								<a href="konfirmasi.html" className="btn btn-success">
									<i className="bi bi-check-circle me-2"></i>Konfirmasi
								</a>
							</div>
						</div>
					</div>
					{/* <!-- KONTEN ATAU ISI DARI TAB MEDIA --> */}
					<div
						className="tab-pane fade"
						id="media-tab-pane"
						role="tabpanel"
						aria-labelledby="media-tab"
						tabIndex="0">
						<div className="card shadow-sm">
							<div className="card-header">
								<h5 className="mb-0">Media Lampiran (2)</h5>
							</div>
							<div className="card-body">
								<div className="row row-cols-1 row-cols-md-2 g-4">
									<div className="col">
										<div className="card">
											<img
												src="https://picsum.photos/seed/kantin/400/300"
												className="card-img-top"
												alt="Bukti Foto 1"
											/>
											<div className="card-body">
												<h6 className="card-title">IMG_20250719_070115.jpg</h6>
												<p className="card-text text-muted small">
													1.2 MB • 19 Jul 2025
												</p>
												<div className="d-flex justify-content-end gap-2">
													<button
														className="btn btn-sm btn-outline-secondary"
														data-bs-toggle="modal"
														data-bs-target="#imageModal">
														<i className="bi bi-eye"></i> Lihat
													</button>
													<a href="#" className="btn btn-sm btn-primary">
														<i className="bi bi-download"></i> Unduh
													</a>
												</div>
											</div>
										</div>
									</div>
									<div className="col">
										<div className="card">
											<img
												src="https://picsum.photos/seed/rokok/400/300"
												className="card-img-top"
												alt="Bukti Foto 2"
											/>
											<div className="card-body">
												<h6 className="card-title">IMG_20250719_070125.jpg</h6>
												<p className="card-text text-muted small">
													1.5 MB • 19 Jul 2025
												</p>
												<div className="d-flex justify-content-end gap-2">
													<button
														className="btn btn-sm btn-outline-secondary"
														data-bs-toggle="modal"
														data-bs-target="#imageModal">
														<i className="bi bi-eye"></i> Lihat
													</button>
													<a href="#" className="btn btn-sm btn-primary">
														<i className="bi bi-download"></i> Unduh
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* <!-- KONTEN ATAU ISI DARI TAB CATATAN INTERNAL (OPSIONAL) --> */}
					<div
						className="tab-pane fade"
						id="catatan-tab-pane"
						role="tabpanel"
						aria-labelledby="catatan-tab"
						tabIndex="0">
						<div className="card shadow-sm">
							<div className="card-header">
								<h5 className="mb-0">Catatan Internal Tim</h5>
							</div>
							<div className="card-body">
								<form>
									<div className="mb-3">
										<label htmlFor="internalNote" className="form-label">
											Tambah Catatan Baru
										</label>
										<textarea
											className="form-control"
											id="internalNote"
											rows="3"
											placeholder="Tulis catatan yang hanya bisa dilihat oleh tim admin..."></textarea>
									</div>
									<button type="submit" className="btn btn-outline-primary">
										<i className="bi bi-plus-circle me-1"></i> Simpan Catatan
									</button>
								</form>
							</div>
							<div className="list-group list-group-flush">
								<div className="list-group-item">
									<p className="mb-1">
										Perlu konfirmasi ke wali kelas terduga pelaku. Jadwalkan
										pertemuan besok pagi.
									</p>
									<small className="text-muted">
										Ditambahkan oleh <strong>Admin Sekolah</strong> pada 20 Jul
										2025, 14:30
									</small>
								</div>
								<div className="list-group-item">
									<p className="mb-1">
										Bukti foto dari pelapor sudah diterima dan diverifikasi.
										Cukup jelas menunjukkan adanya pelanggaran.
									</p>
									<small className="text-muted">
										Ditambahkan oleh <strong>Admin Sekolah</strong> pada 20 Jul
										2025, 11:00
									</small>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* <!--SAAT KLIK GAMBAR AKAN MUNCUL BERUPA MODAL - BERADA DI CONTENT TAB MEDIA --> */}
			<div
				className="modal fade"
				id="imageModal"
				tabIndex="-1"
				aria-labelledby="imageModalLabel"
				aria-hidden="true">
				<div className="modal-dialog modal-lg modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="imageModalLabel">
								IMG_20250719_070115.jpg
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body text-center">
							<img
								src="https://picsum.photos/seed/kantin/800/600"
								className="img-fluid"
								alt="Preview Gambar"
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
