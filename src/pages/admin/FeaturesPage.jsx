export default function FeaturesPage() {
	return (
		<div className="container py-4">
			<div className="p-4 mb-4 bg-white rounded-3 shadow-sm">
				<h1 className="display-6 fw-bold">Menu Fitur 🚀</h1>
				<p className="col-md-8 fs-5 text-muted">
					Description text about something on this page that can be long or
					short. Manage data and perform quick actions from this menu.
				</p>
			</div>

			<h2 className="pb-2 border-bottom mb-4">Manajemen Data</h2>

			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
				<div className="col">
					<a
						href="list-guru.html"
						className="card h-100 text-decoration-none text-dark text-center feature-card shadow-sm">
						<div className="card-body d-flex flex-column justify-content-center">
							<div className="mb-3">
								<i className="bi bi-person-lines-fill fs-1 text-primary"></i>
							</div>
							<h5 className="card-title">List Guru</h5>
						</div>
					</a>
				</div>
				<div className="col">
					<a
						href="list-siswa.html"
						className="card h-100 text-decoration-none text-dark text-center feature-card shadow-sm">
						<div className="card-body d-flex flex-column justify-content-center">
							<div className="mb-3">
								<i className="bi bi-people-fill fs-1 text-info"></i>
							</div>
							<h5 className="card-title">List Siswa</h5>
						</div>
					</a>
				</div>
			</div>

			<h2 className="pb-2 border-bottom my-4">Aksi Cepat</h2>

			<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
				<div className="col">
					<a
						href="tambah-guru.html"
						className="card h-100 text-decoration-none text-dark text-center feature-card shadow-sm">
						<div className="card-body d-flex flex-column justify-content-center">
							<div className="mb-3">
								<i className="bi bi-person-plus-fill fs-1 text-success"></i>
							</div>
							<h5 className="card-title">Tambah Guru</h5>
						</div>
					</a>
				</div>
				<div className="col">
					<a
						href="tambah-siswa.html"
						className="card h-100 text-decoration-none text-dark text-center feature-card shadow-sm">
						<div className="card-body d-flex flex-column justify-content-center">
							<div className="mb-3">
								<i className="bi bi-person-plus-fill fs-1 text-success"></i>
							</div>
							<h5 className="card-title">Tambah Siswa</h5>
						</div>
					</a>
				</div>
			</div>
		</div>
	);
}
