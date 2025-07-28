export default function AddTeacherPage() {
	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Formulir Data Guru</h5>
				</div>
				<div className="card-body">
					<form id="form-tambah-guru">
						<div className="mb-3">
							<label htmlFor="nip" className="form-label">
								NIP
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-badge"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nip"
									placeholder="Masukkan Nomor Induk Pegawai"
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="nama_guru" className="form-label">
								Nama Lengkap & Gelar
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-fill"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nama_guru"
									placeholder="Contoh: Dr. Nama, M.Pd."
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="mapel" className="form-label">
								Mata Pelajaran Utama
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-book-half"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="mapel"
									placeholder="Contoh: Matematika"
									required
								/>
							</div>
						</div>
					</form>
				</div>
				<div className="card-footer bg-white text-end">
					<a href="list-guru.html" className="btn btn-secondary me-2">
						Batal
					</a>
					<button
						type="submit"
						form="form-tambah-guru"
						className="btn btn-primary">
						<i className="bi bi-save me-2"></i>Simpan Data
					</button>
				</div>
			</div>
		</div>
	);
}
