export default function EditTeacherPage() {
	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Formulir Edit Data Guru</h5>
				</div>
				<div className="card-body">
					<form id="form-edit-guru">
						<div className="table-responsive">
							<table className="table table-bordered align-middle">
								<tbody>
									<tr>
										<td className="w-25">
											<strong>NIP</strong>
										</td>
										<td>
											<div className="input-group">
												<span className="input-group-text">
													<i className="bi bi-person-badge"></i>
												</span>
												<input
													type="text"
													className="form-control bg-light"
													id="nip"
													value="197501012005011001"
													readOnly
												/>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<strong>Nama Lengkap & Gelar</strong>
										</td>
										<td>
											<div className="input-group">
												<span className="input-group-text">
													<i className="bi bi-person-fill"></i>
												</span>
												<input
													type="text"
													className="form-control"
													id="nama_guru"
													value="Dr. Iwan Setiawan, M.Pd."
													required
												/>
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<strong>Mata Pelajaran Utama</strong>
										</td>
										<td>
											<div className="input-group">
												<span className="input-group-text">
													<i className="bi bi-book-half"></i>
												</span>
												<input
													type="text"
													className="form-control"
													id="mapel"
													value="Fisika"
													required
												/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</form>
				</div>
				<div className="card-footer bg-white text-end">
					<a href="list-guru.html" className="btn btn-secondary me-2">
						Batal
					</a>
					<button
						type="submit"
						form="form-edit-guru"
						className="btn btn-primary">
						<i className="bi bi-save me-2"></i>Simpan Perubahan
					</button>
				</div>
			</div>
		</div>
	);
}
