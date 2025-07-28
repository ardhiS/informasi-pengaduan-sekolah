export default function AdminOthersPage() {
	return (
		<div className="container py-4">
			<div className="card shadow-sm mb-4">
				<div className="card-body p-3 d-flex align-items-center">
					<i className="bi bi-person-circle fs-1 text-primary me-3"></i>
					<div className="flex-grow-1">
						<h5 className="card-title mb-0">Nama Admin</h5>
						<p className="card-text text-muted mb-0">admin@example.com</p>
					</div>
					<a href="pengaturan.html" className="btn btn-outline-primary btn-sm">
						<i className="bi bi-pencil-square me-1"></i> Edit
					</a>
				</div>
			</div>

			<div className="list-group list-group-flush shadow-sm rounded-3">
				<a
					href="feedback.html"
					className="list-group-item list-group-item-action d-flex align-items-center py-3">
					<i className="bi bi-chat-left-text fs-4 me-3 text-muted"></i>
					<div>
						<h6 className="mb-0">Pusat Bantuan & Feedback</h6>
						<small className="text-muted">
							Hubungi kami atau kirim masukan.
						</small>
					</div>
					<i className="bi bi-chevron-right ms-auto text-muted"></i>
				</a>
				<a
					href="kebijakan.html"
					className="list-group-item list-group-item-action d-flex align-items-center py-3">
					<i className="bi bi-shield-check fs-4 me-3 text-muted"></i>
					<div>
						<h6 className="mb-0">Kebijakan Privasi</h6>
						<small className="text-muted">
							Baca syarat dan ketentuan kami.
						</small>
					</div>
					<i className="bi bi-chevron-right ms-auto text-muted"></i>
				</a>
			</div>

			<div className="list-group mt-4 shadow-sm rounded-3">
				<a
					href="index.html"
					className="list-group-item list-group-item-action text-danger d-flex align-items-center py-3">
					<i className="bi bi-box-arrow-left fs-4 me-3"></i>
					<h6 className="mb-0 fw-bold">Logout</h6>
				</a>
			</div>
		</div>
	);
}
