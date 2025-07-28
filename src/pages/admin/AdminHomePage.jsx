export default function AdminHomePage() {
	return (
		<div className="container mt-4 mb-5">
			<div className="card text-white bg-primary mb-4">
				<div className="card-body">
					<h4 className="card-title">Selamat Datang, Admin!</h4>
					<p className="card-text mb-0">
						Lihat ringkasan dan kelola data melalui menu di bawah ini.
					</p>
				</div>
			</div>

			<h5 className="mb-3">Ringkasan Pengaduan</h5>

			<div className="row g-3 text-center">
				<div className="col-4">
					<div className="card bg-info text-white">
						<div className="card-body">
							<i className="bi bi-journal-plus fs-3"></i>
							<h6 className="mb-0 mt-1">Baru</h6>
							<p className="fs-4 fw-bold mb-0">12</p>
						</div>
					</div>
				</div>
				<div className="col-4">
					<div className="card bg-warning text-dark">
						<div className="card-body">
							<i className="bi bi-hourglass-split fs-3"></i>
							<h6 className="mb-0 mt-1">Pending</h6>
							<p className="fs-4 fw-bold mb-0">5</p>
						</div>
					</div>
				</div>
				<div className="col-4">
					<div className="card bg-success text-white">
						<div className="card-body">
							<i className="bi bi-check2-circle fs-3"></i>
							<h6 className="mb-0 mt-1">Selesai</h6>
							<p className="fs-4 fw-bold mb-0">87</p>
						</div>
					</div>
				</div>
			</div>

			<h5 className="my-4">Aksi Cepat</h5>

			<div className="row g-3 text-center">
				<div className="col-6">
					<a href="list-guru.html" className="text-decoration-none">
						<div className="card card-hover">
							<div className="card-body">
								<div
									className="feature-icon"
									style={{ color: "#0d6efd", backgroundColor: "#cfe2ff" }}>
									<i className="bi bi-person-lines-fill"></i>
								</div>
								<span className="fw-bold text-dark">List Guru</span>
							</div>
						</div>
					</a>
				</div>
				<div className="col-6">
					<a href="list-siswa.html" className="text-decoration-none">
						<div className="card card-hover">
							<div className="card-body">
								<div
									className="feature-icon"
									style={{ color: "#0d6efd", backgroundColor: "#cfe2ff" }}>
									<i className="bi bi-people-fill"></i>
								</div>
								<span className="fw-bold text-dark">List Siswa</span>
							</div>
						</div>
					</a>
				</div>
				<div className="col-6">
					<a href="tambah-guru.html" className="text-decoration-none">
						<div className="card card-hover">
							<div className="card-body">
								<div
									className="feature-icon"
									style={{ color: "#198754", backgroundColor: "#d1e7dd" }}>
									<i className="bi bi-person-plus-fill"></i>
								</div>
								<span className="fw-bold text-dark">Tambah Guru</span>
							</div>
						</div>
					</a>
				</div>
				<div className="col-6">
					<a href="tambah-siswa.html" className="text-decoration-none">
						<div className="card card-hover">
							<div className="card-body">
								<div
									className="feature-icon"
									style={{ color: "#198754", backgroundColor: "#d1e7dd" }}>
									<i className="bi bi-person-plus-fill"></i>
								</div>
								<span className="fw-bold text-dark">Tambah Siswa</span>
							</div>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}
