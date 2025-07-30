import { Link } from "react-router-dom";

export default function StudentsListPage() {
	return (
		<main className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="mb-0">Daftar Siswa</h2>
				<Link to={"/admin/add/student"} className="btn btn-primary">
					<i className="bi bi-plus-circle me-2"></i>Tambah Siswa
				</Link>
			</div>

			<div className="input-group mb-4 shadow-sm">
				<span className="input-group-text bg-white">
					<i className="bi bi-search"></i>
				</span>
				<input
					type="text"
					className="form-control"
					placeholder="Cari nama atau NISN siswa..."
				/>
			</div>

			<div className="card shadow-sm">
				<div className="table-responsive">
					<table className="table table-striped table-hover mb-0 align-middle">
						<thead className="table-light">
							<tr>
								<th scope="col">#</th>
								<th scope="col">Nama Siswa</th>
								<th scope="col">NISN</th>
								<th scope="col">Kelas</th>
								<th scope="col" className="text-end">
									Aksi
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<th scope="row">1</th>
								<td>Budi Santoso</td>
								<td>0012345678</td>
								<td>XII IPA 1</td>
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
								<th scope="row">2</th>
								<td>Citra Lestari</td>
								<td>0012345679</td>
								<td>XII IPS 2</td>
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
								<td>Ahmad Fauzi</td>
								<td>0012345680</td>
								<td>XI IPA 3</td>
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
		</main>
	);
}
