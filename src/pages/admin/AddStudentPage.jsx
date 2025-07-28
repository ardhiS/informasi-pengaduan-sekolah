export default function AddStudentPage() {
	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Formulir Data Siswa</h5>
				</div>
				<div className="card-body">
					<form id="form-tambah-siswa">
						<div className="mb-3">
							<label htmlFor="nisn" className="form-label">
								NISN
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-hash"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nisn"
									placeholder="Masukkan NISN siswa"
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="nama" className="form-label">
								Nama Lengkap
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-fill"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nama"
									placeholder="Masukkan nama lengkap"
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="kelas" className="form-label">
								Kelas
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-easel-fill"></i>
								</span>
								<select
									className="form-select"
									id="kelas"
									required
									defaultValue={"1"}>
									<option value={"1"}>X IPA 1</option>
									<option value={"2"}>XI IPS 2</option>
									<option value={"3"}>XII BAHASA</option>
								</select>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="tgl_lahir" className="form-label">
								Tanggal Lahir
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-calendar-event"></i>
								</span>
								<input
									type="date"
									className="form-control"
									id="tgl_lahir"
									required
								/>
							</div>
						</div>
					</form>
				</div>
				<div className="card-footer bg-white text-end">
					<a href="list-siswa.html" className="btn btn-secondary me-2">
						Batal
					</a>
					<button
						type="submit"
						form="form-tambah-siswa"
						className="btn btn-primary">
						<i className="bi bi-save me-2"></i>Simpan Data
					</button>
				</div>
			</div>
		</div>
	);
}
