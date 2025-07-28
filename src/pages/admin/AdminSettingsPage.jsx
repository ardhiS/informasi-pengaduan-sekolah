export default function AdminSettingsPage() {
	return (
		<div className="container py-4">
			<div className="card shadow-sm mb-4">
				<div className="card-header">
					<h5 className="mb-0">Informasi Pribadi</h5>
				</div>
				<div className="card-body">
					<form id="form-edit-profil">
						<div className="mb-3">
							<label htmlFor="namaAdmin" className="form-label">
								Nama Lengkap
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="namaAdmin"
									value="Nama Admin"
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="emailAdmin" className="form-label">
								Email
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-envelope"></i>
								</span>
								<input
									type="email"
									className="form-control"
									id="emailAdmin"
									value="admin@example.com"
									readOnly
									disabled
								/>
								<span className="input-group-text">
									<i className="bi bi-lock-fill" title="Tidak dapat diubah"></i>
								</span>
							</div>
							<div className="form-text">
								Email tidak dapat diubah karena terikat dengan akun.
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="fotoProfil" className="form-label">
								Ubah Foto Profil
							</label>
							<input className="form-control" type="file" id="fotoProfil" />
						</div>
					</form>
				</div>
			</div>

			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Ubah Password</h5>
				</div>
				<div className="card-body">
					<form id="form-ubah-password">
						<div className="mb-3">
							<label htmlFor="passLama" className="form-label">
								Password Lama
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-key"></i>
								</span>
								<input
									type="password"
									className="form-control"
									id="passLama"
									placeholder="Masukkan password Anda saat ini"
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="passBaru" className="form-label">
								Password Baru
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-lock"></i>
								</span>
								<input
									type="password"
									className="form-control"
									id="passBaru"
									placeholder="Masukkan password baru"
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="konfirmasiPass" className="form-label">
								Konfirmasi Password Baru
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-shield-check"></i>
								</span>
								<input
									type="password"
									className="form-control"
									id="konfirmasiPass"
									placeholder="Ketik ulang password baru"
								/>
							</div>
						</div>
					</form>
				</div>
			</div>

			<div className="d-grid gap-2 mt-4">
				<button
					type="submit"
					form="form-edit-profil"
					className="btn btn-primary btn-lg">
					Simpan Perubahan
				</button>
				<a href="lainnya.html" className="btn btn-outline-secondary">
					Batal
				</a>
			</div>
		</div>
	);
}
