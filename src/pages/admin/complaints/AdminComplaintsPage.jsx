export default function AdminComplaintDetailsPage() {
	return (
		<div className="container py-4">
			<ul className="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
				{/* <!-- TAB BARU --> */}
				<li className="nav-item" role="presentation">
					<button
						className="nav-link active"
						id="pills-baru-tab"
						data-bs-toggle="pill"
						data-bs-target="#pills-baru"
						type="button"
						role="tab"
						aria-controls="pills-baru"
						aria-selected="true">
						Baru <span className="badge bg-white text-primary ms-1">3</span>
					</button>
				</li>
				{/* <!-- TAB PENDING --> */}
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						id="pills-pending-tab"
						data-bs-toggle="pill"
						data-bs-target="#pills-pending"
						type="button"
						role="tab"
						aria-controls="pills-pending"
						aria-selected="false">
						Pending <span className="badge bg-white text-primary ms-1">2</span>
					</button>
				</li>
				{/* <!-- TAB SELESAI --> */}
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						id="pills-selesai-tab"
						data-bs-toggle="pill"
						data-bs-target="#pills-selesai"
						type="button"
						role="tab"
						aria-controls="pills-selesai"
						aria-selected="false">
						Selesai
					</button>
				</li>
				{/* <!-- TAB DITOLAK --> */}
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						id="pills-selesai-tab"
						data-bs-toggle="pill"
						data-bs-target="#pills-ditolak"
						type="button"
						role="tab"
						aria-controls="pills-ditolak"
						aria-selected="false">
						Ditolak
					</button>
				</li>
			</ul>
			{/* <!-- PENCARIAN --> */}
			<div className="input-group mb-4 shadow-sm">
				<span className="input-group-text bg-white border-end-0">
					<i className="bi bi-search"></i>
				</span>
				<input
					type="text"
					className="form-control border-start-0"
					placeholder="Cari berdasarkan ID atau jenis laporan..."
				/>
			</div>

			<div className="tab-content" id="pills-tabContent">
				{/* <!-- KONTEN ATAU ISI DARI TAB BARU --> */}
				<div
					className="tab-pane fade show active"
					id="pills-baru"
					role="tabpanel"
					aria-labelledby="pills-baru-tab"
					tabIndex="0">
					<div className="list-group">
						<a
							href="pengaduan-detail.html"
							className="list-group-item list-group-item-action d-flex align-items-center py-3">
							<div className="icon-circle bg-danger-subtle text-danger">
								<i className="bi bi-fire"></i>
							</div>
							<div className="ms-3 flex-grow-1">
								<div className="d-flex w-100 justify-content-between">
									<h6 className="mb-1 fw-bold">Merokok atau Vaping</h6>
									<small className="text-muted">3 jam lalu</small>
								</div>
								<small className="text-muted">
									ID: #425323 • Dilaporkan oleh Anonim
								</small>
							</div>
							<i className="bi bi-chevron-right ms-3 text-muted"></i>
						</a>
						<a
							href="pengaduan-detail.html"
							className="list-group-item list-group-item-action d-flex align-items-center py-3">
							<div className="icon-circle bg-warning-subtle text-warning">
								<i className="bi bi-person-exclamation"></i>
							</div>
							<div className="ms-3 flex-grow-1">
								<div className="d-flex w-100 justify-content-between">
									<h6 className="mb-1 fw-bold">Perundungan</h6>
									<small className="text-muted">1 hari lalu</small>
								</div>
								<small className="text-muted">
									ID: #535243 • Dilaporkan oleh Anonim
								</small>
							</div>
							<i className="bi bi-chevron-right ms-3 text-muted"></i>
						</a>
						<a
							href="pengaduan-detail.html"
							className="list-group-item list-group-item-action d-flex align-items-center py-3">
							<div className="icon-circle bg-secondary-subtle text-secondary">
								<i className="bi bi-person-x"></i>
							</div>
							<div className="ms-3 flex-grow-1">
								<div className="d-flex w-100 justify-content-between">
									<h6 className="mb-1 fw-bold">Diskriminasi</h6>
									<small className="text-muted">2 hari lalu</small>
								</div>
								<small className="text-muted">
									ID: #763542 • Dilaporkan oleh Anonim
								</small>
							</div>
							<i className="bi bi-chevron-right ms-3 text-muted"></i>
						</a>
					</div>
				</div>
				{/* <!-- KONTEN ATAU ISI DARI TAB PENDING --> */}
				<div
					className="tab-pane fade"
					id="pills-pending"
					role="tabpanel"
					aria-labelledby="pills-pending-tab"
					tabIndex="0">
					<div className="list-group">
						<a
							href="pengaduan-detail.html"
							className="list-group-item list-group-item-action d-flex align-items-center py-3">
							<div className="icon-circle bg-info-subtle text-info">
								<i className="bi bi-tools"></i>
							</div>
							<div className="ms-3 flex-grow-1">
								<div className="d-flex w-100 justify-content-between">
									<h6 className="mb-1 fw-bold">Fasilitas Rusak</h6>
									<small className="text-muted">5 hari lalu</small>
								</div>
								<small className="text-muted">
									ID: #123456 • Menunggu verifikasi
								</small>
							</div>
							<i className="bi bi-chevron-right ms-3 text-muted"></i>
						</a>
						<a
							href="pengaduan-detail.html"
							className="list-group-item list-group-item-action d-flex align-items-center py-3">
							<div className="icon-circle bg-primary-subtle text-primary">
								<i className="bi bi-droplet-half"></i>
							</div>
							<div className="ms-3 flex-grow-1">
								<div className="d-flex w-100 justify-content-between">
									<h6 className="mb-1 fw-bold">Kebersihan Toilet</h6>
									<small className="text-muted">1 minggu lalu</small>
								</div>
								<small className="text-muted">
									ID: #789012 • Dalam peninjauan
								</small>
							</div>
							<i className="bi bi-chevron-right ms-3 text-muted"></i>
						</a>
					</div>
				</div>
				{/* <!-- KONTEN ATAU ISI DARI TAB SELESAI --> */}
				<div
					className="tab-pane fade"
					id="pills-selesai"
					role="tabpanel"
					aria-labelledby="pills-selesai-tab"
					tabIndex="0">
					<div className="text-center p-5 bg-white rounded shadow-sm">
						<i className="bi bi-patch-check-fill fs-1 text-success"></i>
						<h5 className="mt-3">Semua Beres!</h5>
						<p className="text-muted">
							Tidak ada pengaduan yang sudah selesai untuk ditampilkan saat ini.
						</p>
					</div>
				</div>
				{/* <!-- KONTEN ATAU ISI DARI TAB DITOLAK --> */}
				<div
					className="tab-pane fade"
					id="pills-ditolak"
					role="tabpanel"
					aria-labelledby="pills-selesai-tab"
					tabIndex="0">
					<div className="text-center p-5 bg-white rounded shadow-sm">
						<i className="bi bi-patch-check-fill fs-1 text-success"></i>
						<h5 className="mt-3">Tidak ada Pengaduan!</h5>
						<p className="text-muted">
							Tidak ada pengaduan yang Ditolak untuk ditampilkan saat ini.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
