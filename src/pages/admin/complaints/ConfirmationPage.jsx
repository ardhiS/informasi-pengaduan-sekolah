export default function ConfirmationLogPage() {
	return (
		<div className="container py-4">
			<ul className="nav nav-tabs nav-fill mb-3" id="myTab" role="tablist">
				<li className="nav-item" role="presentation">
					<button
						className="nav-link active"
						id="konfirmasi-tab"
						data-bs-toggle="tab"
						data-bs-target="#konfirmasi-pane"
						type="button"
						role="tab"
						aria-controls="konfirmasi-pane"
						aria-selected="true">
						<i className="bi bi-check2-square me-1"></i> Konfirmasi
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						id="catatan-tab"
						data-bs-toggle="tab"
						data-bs-target="#catatan-pane"
						type="button"
						role="tab"
						aria-controls="catatan-pane"
						aria-selected="false">
						<i className="bi bi-pencil-square me-1"></i> Catatan Internal
					</button>
				</li>
				{/* <!-- <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="log-tab"
            data-bs-toggle="tab"
            data-bs-target="#log-pane"
            type="button"
            role="tab"
            aria-controls="log-pane"
            aria-selected="false"
          >
            <i className="bi bi-clock-history me-1"></i> Riwayat Log
          </button>
        </li> */}
			</ul>

			<div className="tab-content" id="myTabContent">
				<div
					className="tab-pane fade show active"
					id="konfirmasi-pane"
					role="tabpanel"
					aria-labelledby="konfirmasi-tab"
					tabIndex="0">
					<div className="card shadow-sm">
						<div className="card-header">
							<h5 className="mb-0">Formulir Konfirmasi Tindakan</h5>
						</div>
						<div className="card-body">
							<form action="pengaduan-detail.html" id="konfirmasi-form">
								<label className="form-label">Status Akhir</label>
								<div className="input-group mb-3">
									<span className="input-group-text">
										<i className="bi bi-tag-fill"></i>
									</span>
									<select
										className="form-select"
										id="status"
										required
										defaultValue={"1"}>
										<option value="1">Selesai</option>
										<option value="2">Perlu Tindak Lanjut</option>
										<option value="3">Tidak Terbukti</option>
									</select>
								</div>

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
									/>
								</div>

								<label className="form-label">Tanggal Tindakan</label>
								<div className="input-group mb-4">
									<span className="input-group-text">
										<i className="bi bi-calendar-event"></i>
									</span>
									<input
										type="date"
										className="form-control"
										value="2025-07-21"
										required
									/>
								</div>

								<label className="form-label">Tindakan yang Diambil</label>
								<div className="bg-white p-3 border rounded mb-3">
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											id="tindakan1"
										/>
										<label className="form-check-label" htmlFor="tindakan1">
											Peringatan Lisan
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											id="tindakan2"
										/>
										<label className="form-check-label" htmlFor="tindakan2">
											Peringatan Tertulis
										</label>
									</div>
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											id="tindakan3"
										/>
										<label className="form-check-label" htmlFor="tindakan3">
											Mediasi antara Pihak Terlibat
										</label>
									</div>
									<hr />
									<div className="form-check">
										<input
											className="form-check-input"
											type="checkbox"
											value=""
											id="tindakanLainnyaCheck"
										/>
										<label
											className="form-check-label"
											htmlFor="tindakanLainnyaCheck">
											Lainnya...
										</label>
									</div>
									<input
										type="text"
										className="form-control form-control-sm mt-2"
										id="tindakanLainnyaText"
										placeholder="Sebutkan tindakan yang diambil"
										disabled
									/>
								</div>

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
										placeholder="Jelaskan secara singkat tindakan yang telah dilakukan..."></textarea>
								</div>
							</form>
						</div>
						<div className="card-footer bg-white text-end">
							<a
								href="pengaduan-detail.html"
								className="btn btn-secondary me-2">
								<i className="bi bi-x-lg me-1"></i> Batal
							</a>
							<button
								type="submit"
								form="konfirmasi-form"
								className="btn btn-primary">
								<i className="bi bi-check2-circle me-1"></i> Simpan Konfirmasi
							</button>
						</div>
					</div>
				</div>

				<div
					className="tab-pane fade"
					id="catatan-pane"
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
									Bukti foto dari pelapor sudah diterima dan diverifikasi. Cukup
									jelas menunjukkan adanya pelanggaran.
								</p>
								<small className="text-muted">
									Ditambahkan oleh <strong>Kepala Sekolah</strong> pada 20 Jul
									2025, 11:00
								</small>
							</div>
						</div>
					</div>
				</div>

				<div
					className="tab-pane fade"
					id="log-pane"
					role="tabpanel"
					aria-labelledby="log-tab"
					tabIndex="0">
					<div className="card shadow-sm">
						<div className="card-header">
							<h5 className="mb-0">Riwayat Aktivitas Tiket</h5>
						</div>
						<ul className="list-group list-group-flush">
							<li className="list-group-item d-flex align-items-start py-3">
								<i className="bi bi-pencil-fill text-primary fs-4 me-3"></i>
								<div className="flex-grow-1">
									<strong>Admin Sekolah</strong> mengonfirmasi tindakan dan
									mengubah status menjadi
									<span className="badge bg-success">Selesai</span>.
									<div className="text-muted small mt-1">
										21 Jul 2025, 09:14
									</div>
								</div>
							</li>
							<li className="list-group-item d-flex align-items-start py-3">
								<i className="bi bi-chat-dots-fill text-muted fs-4 me-3"></i>
								<div className="flex-grow-1">
									<strong>Admin Sekolah</strong> menambahkan catatan internal.
									<div className="text-muted small mt-1">
										20 Jul 2025, 14:30
									</div>
								</div>
							</li>
							<li className="list-group-item d-flex align-items-start py-3">
								<i className="bi bi-eye-fill text-info fs-4 me-3"></i>
								<div className="flex-grow-1">
									<strong>Kepala Sekolah</strong> melihat detail pengaduan.
									<div className="text-muted small mt-1">
										20 Jul 2025, 10:45
									</div>
								</div>
							</li>
							<li className="list-group-item d-flex align-items-start py-3">
								<i className="bi bi-file-earmark-plus-fill text-success fs-4 me-3"></i>
								<div className="flex-grow-1">
									Tiket pengaduan <strong>#42523</strong> dibuat oleh sistem.
									<div className="text-muted small mt-1">
										19 Jul 2025, 07:00
									</div>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
