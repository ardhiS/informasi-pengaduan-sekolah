export default function TeachersList() {
	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="mb-0">Daftar Guru</h2>
				<a href="tambah-guru.html" className="btn btn-primary">
					<i className="bi bi-plus-circle me-2"></i>Tambah Guru
				</a>
			</div>

			<div className="input-group mb-4 shadow-sm">
				<span className="input-group-text bg-white">
					<i className="bi bi-search"></i>
				</span>
				<input
					type="text"
					className="form-control"
					placeholder="Cari nama atau NIP guru..."
				/>
			</div>

			<div className="card shadow-sm">
				<div className="table-responsive">
					<table className="table table-striped table-hover mb-0 align-middle">
						<thead className="table-light">
							<tr>
								<th scope="col">#</th>
								<th scope="col">Nama Guru</th>
								<th scope="col">NIP</th>
								<th scope="col">Mata Pelajaran</th>
								<th scope="col" className="text-end">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">1</th>
								<td>Dr. Iwan Setiawan, M.Pd.</td>
								<td>197501012005011001</td>
								<td>Fisika</td>
								<td className="text-end">
									<a
										href="edit-guru.html"
										className="btn btn-sm btn-outline-primary">
										<i className="bi bi-pencil-square"></i>
									</a>
									<a href="#" className="btn btn-sm btn-outline-danger">
										<i className="bi bi-trash"></i>
									</a>
								</td>
							</tr>
							<tr>
								<th scope="row">2</th>
								<td>Siti Aminah, S.S.</td>
								<td>198205102008012002</td>
								<td>Bahasa Inggris</td>
								<td className="text-end">
									<a href="#" className="btn btn-sm btn-outline-primary">
										<i className="bi bi-pencil-square"></i>
									</a>
									<a href="#" className="btn btn-sm btn-outline-danger">
										<i className="bi bi-trash"></i>
									</a>
								</td>
							</tr>
							<tr>
								<th scope="row">3</th>
								<td>Bambang Wijoyo, S.Kom.</td>
								<td>199011202015031005</td>
								<td>Teknologi Informasi</td>
								<td className="text-end">
									<a href="#" className="btn btn-sm btn-outline-primary">
										<i className="bi bi-pencil-square"></i>
									</a>
									<a href="#" className="btn btn-sm btn-outline-danger">
										<i className="bi bi-trash"></i>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
