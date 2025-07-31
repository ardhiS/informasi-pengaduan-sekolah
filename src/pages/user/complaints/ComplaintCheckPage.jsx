import React from "react";
import { Link, useNavigate } from "react-router-dom";

import SecurityAlert from "../../../components/SecurityAlert";
import useInput from "../../../hooks/useInput";

export default function ComplaintCheckPage() {
	const [inputComplaintId, onComplaintIdChange] = useInput();
	const navigate = useNavigate();
	function handleSubmit(e) {
		e.preventDefault();
		const complaintId = inputComplaintId;
		navigate(`/user/complaints/detail/${complaintId}`);
	}

	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-lg-8 text-start">
					<h1
						className="display-6 fw-bold mb-3 text-info"
						data-lang-id="Cek Pengaduan Anda">
						Cek Pengaduan Anda
					</h1>
					<p
						className="fs-6 mb-5 fw-normal lh-lg"
						data-lang-id="Masukkan kode pengaduan untuk melihat perkembangan laporan Anda">
						Masukkan kode pengaduan untuk melihat perkembangan laporan Anda.
					</p>

					<div className="card border-0 bg-body-secondary mt-4">
						<div className="card-body p-5 text-center">
							<div className="mb-4">
								<i
									className="bi bi-search-heart text-info"
									style={{ fontSize: "3.5rem" }}></i>
							</div>

							<h3
								className="card-title mb-4 fs-4 fw-bold text-info"
								data-lang-id="Masukkan Kode Pengaduan">
								Masukkan Kode Pengaduan
							</h3>

							<form onSubmit={handleSubmit}>
								<div className="mb-5">
									<label
										htmlFor="kodePengaduan"
										className="form-label fw-semibold text-body mb-3 fs-5">
										Kode Pengaduan
									</label>
									<input
										type="text"
										className="form-control form-control-lg text-center fw-medium"
										id="kodePengaduan"
										name="kode"
										placeholder="0000 0000 0000 0000"
										maxLength="19"
										style={{ fontSize: "1.1rem", letterSpacing: "0.1em" }}
										value={inputComplaintId}
										onChange={onComplaintIdChange}
										required
									/>
									<div className="form-text mt-3">
										<p className="text-body fw-medium mb-0">
											Masukkan 16 digit kode pengaduan yang Anda terima
										</p>
									</div>
								</div>

								<div className="row justify-content-center mt-5">
									<div className="col-md-6">
										<button
											type="submit"
											className="btn btn-info btn-lg w-100 py-3 fw-semibold rounded-3 shadow-sm">
											<i className="bi bi-search me-2 fs-5"></i>Cari Pengaduan
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="text-center mt-4">
				<Link to="/user/home" className="btn btn-outline-info me-2">
					<i className="bi bi-house me-2"></i>Kembali ke Beranda
				</Link>
				<Link to="/user/complaints/list" className="btn btn-info">
					<i className="bi bi-card-list me-2"></i>Lihat Semua Pengaduan
				</Link>
			</div>
			<SecurityAlert />
		</main>
	);
}
